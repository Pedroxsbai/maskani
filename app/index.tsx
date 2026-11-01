import { MaskaniLogo } from '@/components/maskani-logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { ArrowRightIcon, MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Aperçu du thème',
  headerRight: () => <ThemeToggle />,
};

export default function ThemePreviewScreen() {
  const [acceptsTerms, setAcceptsTerms] = React.useState(false);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="flex-grow justify-center gap-8 p-6"
        className="bg-background">
        <View className="items-center gap-4">
          <MaskaniLogo variant="mark" width={140} />
          <MaskaniLogo width={220} />
          <Text variant="h3" className="text-center">
            Trouvez votre chez-vous au Maroc
          </Text>
        </View>

        <View className="gap-3">
          <Button size="lg">
            <Text>S'inscrire</Text>
            <Icon as={ArrowRightIcon} />
          </Button>
          <Button size="lg" variant="secondary">
            <Text>Se connecter</Text>
          </Button>
          <Button variant="link">
            <Text>Explorer sans compte</Text>
          </Button>
        </View>

        <View className="gap-2">
          <Label nativeID="email">Adresse e-mail</Label>
          <Input
            aria-labelledby="email"
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="flex-row items-center gap-3">
          <Checkbox checked={acceptsTerms} onCheckedChange={setAcceptsTerms} aria-labelledby="terms" />
          <Label nativeID="terms" onPress={() => setAcceptsTerms(!acceptsTerms)}>
            J'accepte les conditions d'utilisation
          </Label>
        </View>
      </ScrollView>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
