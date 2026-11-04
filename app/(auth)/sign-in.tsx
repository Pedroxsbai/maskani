import { AuthHeader } from '@/components/auth-header';
import { FormAlert } from '@/components/form-alert';
import { PasswordField } from '@/components/password-field';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { signIn } from '@/lib/auth';
import { type FormErrors, hasErrors, type SignInValues, validateSignIn } from '@/lib/auth-validation';
import { Link, router } from 'expo-router';
import { ArrowRightIcon, MailIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<FormErrors<SignInValues>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const validationErrors = validateSignIn({ email, password });
    setErrors(validationErrors);
    setFormError(null);
    if (hasErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);
    const result = await signIn({ email, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    router.replace('/explore');
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow gap-8 p-6"
      className="bg-background">
      <AuthHeader title="Bon retour !" subtitle="Connectez-vous pour continuer sur MASKANI." />

      <View className="gap-4">
        <TextField
          label="Adresse e-mail"
          icon={MailIcon}
          placeholder="votre@email.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <PasswordField
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
      </View>

      {formError ? <FormAlert message={formError} /> : null}

      <Button size="lg" onPress={handleSubmit} disabled={isSubmitting}>
        <Text>{isSubmitting ? 'Connexion…' : 'Se connecter'}</Text>
        {isSubmitting ? null : <Icon as={ArrowRightIcon} />}
      </Button>

      <View className="flex-row items-center justify-center">
        <Text variant="muted">Pas encore de compte ?</Text>
        <Link href="/sign-up" replace asChild>
          <Button variant="link" size="sm">
            <Text>S'inscrire</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
