import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { UserIcon } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <EmptyState
      icon={UserIcon}
      title="Votre profil"
      description="Connectez-vous pour gérer votre compte et vos annonces.">
      <Link href="/sign-in" asChild>
        <Button size="lg">
          <Text>Se connecter</Text>
        </Button>
      </Link>
    </EmptyState>
  );
}
