import { AuthHeader } from '@/components/auth-header';
import { PasswordField } from '@/components/password-field';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { type FormErrors, type SignUpValues, validateSignUp } from '@/lib/auth-validation';
import { Link } from 'expo-router';
import { ArrowRightIcon, MailIcon, UserIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function SignUpScreen() {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [acceptsTerms, setAcceptsTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors<SignUpValues>>({});

  function handleSubmit() {
    setErrors(validateSignUp({ fullName, email, phone, password, acceptsTerms }));
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-grow gap-8 p-6"
      className="bg-background">
      <AuthHeader
        title="Créer votre compte"
        subtitle="Rejoignez MASKANI et trouvez votre prochain logement au Maroc."
      />

      <View className="gap-4">
        <TextField
          label="Nom complet"
          icon={UserIcon}
          placeholder="Votre nom complet"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />
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
        <TextField
          label="Numéro de téléphone"
          prefix="+212"
          placeholder="6 12 34 56 78"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
        <PasswordField
          label="Mot de passe"
          placeholder="8 caractères minimum"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <View className="gap-2">
          <View className="flex-row items-center gap-3">
            <Checkbox checked={acceptsTerms} onCheckedChange={setAcceptsTerms} aria-labelledby="terms" />
            <Label nativeID="terms" className="flex-1" onPress={() => setAcceptsTerms(!acceptsTerms)}>
              J'accepte les conditions d'utilisation et la politique de confidentialité
            </Label>
          </View>
          {errors.acceptsTerms ? (
            <Text className="text-sm text-destructive">{errors.acceptsTerms}</Text>
          ) : null}
        </View>
      </View>

      <Button size="lg" onPress={handleSubmit}>
        <Text>Créer mon compte</Text>
        <Icon as={ArrowRightIcon} />
      </Button>

      <View className="flex-row items-center justify-center">
        <Text variant="muted">Déjà un compte ?</Text>
        <Link href="/sign-in" replace asChild>
          <Button variant="link" size="sm">
            <Text>Se connecter</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
