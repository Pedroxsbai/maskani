import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { CompassIcon } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <EmptyState icon={CompassIcon} title="Page introuvable" description="Cet écran n'existe pas.">
      <Link href="/" replace asChild>
        <Button size="lg">
          <Text>Retour à l'accueil</Text>
        </Button>
      </Link>
    </EmptyState>
  );
}
