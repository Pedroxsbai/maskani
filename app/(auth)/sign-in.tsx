import { MaskaniLogo } from '@/components/maskani-logo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function SignInScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex-grow gap-8 p-6"
      className="bg-background">
      <View className="items-center">
        <MaskaniLogo width={180} />
      </View>

      <View className="gap-2">
        <Text variant="h3">Bon retour !</Text>
        <Text variant="muted" className="text-base">
          Connectez-vous pour continuer sur MASKANI.
        </Text>
      </View>

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
