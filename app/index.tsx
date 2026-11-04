import { useSession } from '@/providers/session-provider';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }
  return <Redirect href={session ? '/explore' : '/welcome'} />;
}
