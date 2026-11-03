import { MaskaniLogo } from '@/components/maskani-logo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function SignUpScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex-grow gap-8 p-6"
      className="bg-background">
      <View className="items-center">
        <MaskaniLogo width={180} />
      </View>

      <View className="gap-2">
        <Text variant="h3">Créer votre compte</Text>
        <Text variant="muted" className="text-base">
          Rejoignez MASKANI et trouvez votre prochain logement au Maroc.
        </Text>
      </View>

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
