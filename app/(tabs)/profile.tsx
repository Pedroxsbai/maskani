import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { signOut } from '@/lib/auth';
import { useSession } from '@/providers/session-provider';
import type { User } from '@supabase/supabase-js';
import { Link, router } from 'expo-router';
import { LogOutIcon, UserIcon } from 'lucide-react-native';
import * as React from 'react';
import { Alert } from 'react-native';

export default function ProfileScreen() {
  const { session } = useSession();

  if (!session) {
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

  return <SignedInProfile user={session.user} />;
}

type SignedInProfileProps = {
  user: User;
};

function SignedInProfile({ user }: SignedInProfileProps) {
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const fullName = user.user_metadata.full_name;

  async function confirmSignOut() {
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);

    if (!result.ok) {
      Alert.alert('Déconnexion impossible', result.message);
      return;
    }
    router.replace('/welcome');
  }

  function handleSignOut() {
    Alert.alert('Se déconnecter', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: confirmSignOut },
    ]);
  }

  return (
    <EmptyState
      icon={UserIcon}
      title={typeof fullName === 'string' ? fullName : 'Mon compte'}
      description={user.email ?? ''}>
      <Button variant="outline" size="lg" onPress={handleSignOut} disabled={isSigningOut}>
        <Icon as={LogOutIcon} className="text-destructive" />
        <Text className="text-destructive">{isSigningOut ? 'Déconnexion…' : 'Se déconnecter'}</Text>
      </Button>
    </EmptyState>
  );
}
