import { EmptyState } from '@/components/empty-state';
import { CalendarCheckIcon } from 'lucide-react-native';

export default function VisitsScreen() {
  return (
    <EmptyState
      icon={CalendarCheckIcon}
      title="Aucune visite"
      description="Vos demandes de visite apparaîtront ici."
    />
  );
}
