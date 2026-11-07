import { EmptyState } from '@/components/empty-state';
import { SearchIcon } from 'lucide-react-native';

export default function ExploreScreen() {
  return (
    <EmptyState
      icon={SearchIcon}
      title="Explorer les logements"
      description="Les maisons et appartements à louer apparaîtront ici."
    />
  );
}
