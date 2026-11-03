type SignInValues = {
  email: string;
  password: string;
};

type SignUpValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  acceptsTerms: boolean;
};

type FormErrors<Values> = Partial<Record<keyof Values, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOROCCAN_MOBILE_PATTERN = /^[5-7]\d{8}$/;
const MIN_PASSWORD_LENGTH = 8;
const MIN_FULL_NAME_LENGTH = 2;
const MAX_FULL_NAME_LENGTH = 100;

function normalizeMoroccanPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '').replace(/^212/, '').replace(/^0/, '');
  return MOROCCAN_MOBILE_PATTERN.test(digits) ? `+212${digits}` : null;
}

function getEmailError(email: string): string | undefined {
  if (!email.trim()) {
    return "L'adresse e-mail est obligatoire.";
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Adresse e-mail invalide.';
  }
  return undefined;
}

function validateSignIn({ email, password }: SignInValues): FormErrors<SignInValues> {
  const errors: FormErrors<SignInValues> = {};

  const emailError = getEmailError(email);
  if (emailError) {
    errors.email = emailError;
  }
  if (!password) {
    errors.password = 'Le mot de passe est obligatoire.';
  }

  return errors;
}

function validateSignUp(values: SignUpValues): FormErrors<SignUpValues> {
  const errors: FormErrors<SignUpValues> = {};
  const fullNameLength = values.fullName.trim().length;

  if (fullNameLength < MIN_FULL_NAME_LENGTH || fullNameLength > MAX_FULL_NAME_LENGTH) {
    errors.fullName = 'Entrez votre nom complet.';
  }

  const emailError = getEmailError(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!values.phone.trim()) {
    errors.phone = 'Le numéro de téléphone est obligatoire.';
  } else if (!normalizeMoroccanPhone(values.phone)) {
    errors.phone = 'Numéro marocain invalide (ex. 6 12 34 56 78).';
  }

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  if (!values.acceptsTerms) {
    errors.acceptsTerms = "Vous devez accepter les conditions d'utilisation.";
  }

  return errors;
}

function hasErrors<Values>(errors: FormErrors<Values>): boolean {
  return Object.keys(errors).length > 0;
}

export { hasErrors, normalizeMoroccanPhone, validateSignIn, validateSignUp };
export type { FormErrors, SignInValues, SignUpValues };
