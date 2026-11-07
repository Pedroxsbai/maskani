import { normalizeMoroccanPhone, type SignInValues, type SignUpValues } from '@/lib/auth-validation';
import { supabase } from '@/lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

type AuthResult = { ok: true } | { ok: false; message: string };

type SignUpInput = Omit<SignUpValues, 'acceptsTerms'>;

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou mot de passe incorrect.',
  user_already_exists: 'Un compte existe déjà avec cette adresse e-mail.',
  email_exists: 'Un compte existe déjà avec cette adresse e-mail.',
  email_address_invalid: 'Adresse e-mail refusée. Essayez une autre adresse.',
  weak_password: 'Mot de passe trop faible. Choisissez-en un plus long.',
  email_not_confirmed: 'Confirmez votre adresse e-mail avant de vous connecter.',
  over_request_rate_limit: 'Trop de tentatives. Réessayez dans quelques minutes.',
  over_email_send_rate_limit: 'Trop de tentatives. Réessayez dans quelques minutes.',
  signup_disabled: 'Les inscriptions sont fermées pour le moment.',
};

const DEFAULT_ERROR_MESSAGE = 'Une erreur est survenue. Vérifiez votre connexion Internet et réessayez.';

function toFailure(error: AuthError): AuthResult {
  return { ok: false, message: (error.code && ERROR_MESSAGES[error.code]) || DEFAULT_ERROR_MESSAGE };
}

async function signIn({ email, password }: SignInValues): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? toFailure(error) : { ok: true };
}

async function signUp({ fullName, email, phone, password }: SignUpInput): Promise<AuthResult> {
  const normalizedPhone = normalizeMoroccanPhone(phone);
  if (!normalizedPhone) {
    return { ok: false, message: 'Numéro marocain invalide.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName.trim(), phone: normalizedPhone },
    },
  });

  if (error) {
    return toFailure(error);
  }
  if (!data.session) {
    return { ok: false, message: 'Compte créé. Confirmez votre adresse e-mail, puis connectez-vous.' };
  }
  return { ok: true };
}

async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  return error ? toFailure(error) : { ok: true };
}

export { signIn, signOut, signUp };
export type { AuthResult, SignUpInput };
