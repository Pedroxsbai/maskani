
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { useSession } from '@/providers/session-provider';
import type { User } from '@supabase/supabase-js';
import { Link, router } from 'expo-router';
import { LogOutIcon, UserIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Switch,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { session } = useSession();

  if (!session) {
    return (
      <EmptyState
        icon={UserIcon}
        title="Votre profil"
        description="Connectez-vous pour gérer votre compte et vos annonces."
      >
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
  const [isLoadingSettings, setIsLoadingSettings] = React.useState(true);
  const [isUpdatingOwnerMode, setIsUpdatingOwnerMode] =
    React.useState(false);

  const [ownerModeEnabled, setOwnerModeEnabled] = React.useState(false);
  const [accountStatus, setAccountStatus] = React.useState<
    'active' | 'suspended' | null
  >(null);

  const [settingsError, setSettingsError] = React.useState(false);

  const fullName = user.user_metadata.full_name;

  React.useEffect(() => {
    let isMounted = true;

    async function loadProfileSettings() {
      setIsLoadingSettings(true);
      setSettingsError(false);

      const { data, error } = await supabase
        .from('profiles')
        .select('owner_mode_enabled, status')
        .eq('id', user.id)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setSettingsError(true);
        setIsLoadingSettings(false);
        return;
      }

      setOwnerModeEnabled(data.owner_mode_enabled);
      setAccountStatus(data.status);
      setIsLoadingSettings(false);
    }

    loadProfileSettings();

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  async function handleOwnerModeChange(enabled: boolean) {
    if (accountStatus !== 'active') {
      Alert.alert(
        'Compte suspendu',
        'Le mode propriétaire n’est pas disponible pour ce compte.'
      );
      return;
    }

    setIsUpdatingOwnerMode(true);

    const { data, error } = await supabase
      .from('profiles')
      .update({ owner_mode_enabled: enabled })
      .eq('id', user.id)
      .select('owner_mode_enabled, status')
      .single();

    setIsUpdatingOwnerMode(false);

    if (error || !data) {
      Alert.alert(
        'Modification impossible',
        error?.message ?? 'Une erreur est survenue.'
      );
      return;
    }

    setOwnerModeEnabled(data.owner_mode_enabled);
    setAccountStatus(data.status);

    Alert.alert(
      'Mode propriétaire',
      data.owner_mode_enabled
        ? 'Le mode propriétaire est activé.'
        : 'Le mode propriétaire est désactivé.'
    );
  }

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
    Alert.alert(
      'Se déconnecter',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: confirmSignOut,
        },
      ]
    );
  }

  return (
    <EmptyState
      icon={UserIcon}
      title={typeof fullName === 'string' ? fullName : 'Mon compte'}
      description={user.email ?? ''}
    >
      <View className="w-full gap-3 rounded-xl border border-border p-4">
        <Text className="text-lg font-semibold">
          Espace propriétaire
        </Text>

        <Text className="text-sm text-muted-foreground">
          Activez ce mode pour pouvoir publier et gérer vos annonces
          immobilières.
        </Text>

        {isLoadingSettings ? (
          <ActivityIndicator />
        ) : settingsError ? (
          <Text className="text-sm text-destructive">
            Impossible de charger les paramètres du profil.
          </Text>
        ) : (
          <>
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="font-medium">
                  Mode propriétaire
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {ownerModeEnabled ? 'Activé' : 'Désactivé'}
                </Text>
              </View>

              <Switch
                value={ownerModeEnabled}
                onValueChange={handleOwnerModeChange}
                disabled={
                  isUpdatingOwnerMode || accountStatus !== 'active'
                }
                accessibilityLabel="Activer le mode propriétaire"
              />
            </View>

            {isUpdatingOwnerMode && (
              <ActivityIndicator />
            )}

            {accountStatus === 'suspended' && (
              <Text className="text-sm text-destructive">
                Votre compte est suspendu. Le mode propriétaire
                n’est pas disponible.
              </Text>
            )}
          </>
        )}
      </View>

      <Button
        variant="outline"
        size="lg"
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        <Icon as={LogOutIcon} className="text-destructive" />
        <Text className="text-destructive">
          {isSigningOut ? 'Déconnexion…' : 'Se déconnecter'}
        </Text>
      </Button>
    </EmptyState>
  );
}
