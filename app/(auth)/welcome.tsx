import { MaskaniLogo } from '@/components/maskani-logo';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { ArrowRightIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex-grow justify-center gap-10 p-6"
      className="bg-background">
      <View className="items-center gap-4">
        <MaskaniLogo variant="mark" width={140} />
        <MaskaniLogo width={220} />
        <Text variant="h3" className="text-center">
          Trouvez votre chez-vous au Maroc
        </Text>
      </View>

      <View className="gap-3">
        <Link href="/sign-up" asChild>
          <Button size="lg">
            <Text>S'inscrire</Text>
            <Icon as={ArrowRightIcon} />
          </Button>
        </Link>
        <Link href="/sign-in" asChild>
          <Button size="lg" variant="secondary">
            <Text>Se connecter</Text>
          </Button>
        </Link>
        <Link href="/explore" replace asChild>
          <Button variant="link">
            <Text>Explorer sans compte</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
