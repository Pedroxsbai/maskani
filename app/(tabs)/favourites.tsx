import { EmptyState } from '@/components/empty-state';
import { HeartIcon } from 'lucide-react-native';

export default function FavouritesScreen() {
  return (
    <EmptyState
      icon={HeartIcon}
      title="Aucun favori"
      description="Les logements que vous enregistrez apparaîtront ici."
    />
  );
}
