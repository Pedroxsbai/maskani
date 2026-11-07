import { EmptyState } from '@/components/empty-state';
import { MessageCircleIcon } from 'lucide-react-native';

export default function MessagesScreen() {
  return (
    <EmptyState
      icon={MessageCircleIcon}
      title="Aucun message"
      description="Vos conversations avec les propriétaires apparaîtront ici."
    />
  );
}
