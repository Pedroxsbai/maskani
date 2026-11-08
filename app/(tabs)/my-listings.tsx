
import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  Home,
  Plus,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Pencil,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock3,
  KeyRound,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';

type ListingStatus = 'published' | 'draft' | 'rented';

type ListingItem = {
  id: string;
  title: string;
  city: string;
  neighbourhood: string;
  rent: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  status: ListingStatus;
};

const initialListings: ListingItem[] = [
  {
    id: '1',
    title: 'Appartement moderne',
    city: 'Oujda',
    neighbourhood: 'Centre-ville',
    rent: 3500,
    surface: 95,
    bedrooms: 2,
    bathrooms: 1,
    status: 'published',
  },
  {
    id: '2',
    title: 'Villa familiale',
    city: 'Berkane',
    neighbourhood: 'Quartier résidentiel',
    rent: 6500,
    surface: 180,
    bedrooms: 4,
    bathrooms: 2,
    status: 'draft',
  },
  {
    id: '3',
    title: 'Studio meublé',
    city: 'Oujda',
    neighbourhood: 'Hay Al Qods',
    rent: 2200,
    surface: 45,
    bedrooms: 1,
    bathrooms: 1,
    status: 'rented',
  },
];

const filters = [
  { label: 'Toutes', value: 'all' },
  { label: 'Publiées', value: 'published' },
  { label: 'Brouillons', value: 'draft' },
  { label: 'Louées', value: 'rented' },
] as const;

function StatusBadge({ status }: { status: ListingStatus }) {
  const config = {
    published: {
      label: 'Publiée',
      background: 'bg-green-100',
      color: 'text-green-700',
      icon: CheckCircle2,
    },
    draft: {
      label: 'Brouillon',
      background: 'bg-amber-100',
      color: 'text-amber-700',
      icon: Clock3,
    },
    rented: {
      label: 'Louée',
      background: 'bg-blue-100',
      color: 'text-blue-700',
      icon: KeyRound,
    },
  }[status];

  const Icon = config.icon;

  return (
    <View
      className={`flex-row items-center gap-1 self-start rounded-full px-3 py-1 ${config.background}`}
    >
      <Icon size={13} color="#15803D" />
      <Text className={`text-xs font-semibold ${config.color}`}>
        {config.label}
      </Text>
    </View>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Home;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4">
      <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-green-50">
        <Icon size={19} color="#168F75" />
      </View>

      <Text className="text-2xl font-bold text-gray-900">
        {value}
      </Text>

      <Text className="mt-1 text-xs text-gray-500">
        {label}
      </Text>
    </View>
  );
}

export default function MyListingsScreen() {
  const [listings, setListings] = useState(initialListings);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredListings = useMemo(() => {
    if (activeFilter === 'all') {
      return listings;
    }

    return listings.filter(
      (listing) => listing.status === activeFilter,
    );
  }, [listings, activeFilter]);

  const publishedCount = listings.filter(
    (listing) => listing.status === 'published',
  ).length;

  const draftCount = listings.filter(
    (listing) => listing.status === 'draft',
  ).length;

  const rentedCount = listings.filter(
    (listing) => listing.status === 'rented',
  ).length;

  const toggleVisibility = (id: string) => {
    setListings((current) =>
      current.map((listing) => {
        if (listing.id !== id) {
          return listing;
        }

        if (listing.status === 'published') {
          return { ...listing, status: 'draft' };
        }

        if (listing.status === 'draft') {
          return { ...listing, status: 'published' };
        }

        return listing;
      }),
    );
  };

  const handleEdit = () => {
    Alert.alert(
      'Modifier une annonce',
      'La modification sera disponible dans une prochaine étape.',
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 35 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Mes annonces
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Gérez vos biens immobiliers en un seul endroit.
          </Text>
        </View>

        {/* Statistics */}
        <View className="mb-6 flex-row gap-3">
          <StatCard
            label="Publiées"
            value={publishedCount}
            icon={CheckCircle2}
          />

          <StatCard
            label="Brouillons"
            value={draftCount}
            icon={Clock3}
          />

          <StatCard
            label="Louées"
            value={rentedCount}
            icon={KeyRound}
          />
        </View>

        {/* Create listing */}
        <Pressable
          onPress={() => router.push('/create-listing')}
          className="mb-6 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <Plus size={21} color="#FFFFFF" />

          <Text className="font-bold text-white">
            Créer une annonce
          </Text>
        </Pressable>

        {/* Filters */}
        <View className="mb-5">
          <Text className="mb-3 text-base font-bold text-gray-900">
            Toutes mes propriétés
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.map((filter) => {
              const selected = activeFilter === filter.value;

              return (
                <Pressable
                  key={filter.value}
                  onPress={() => setActiveFilter(filter.value)}
                  className={`rounded-full border px-4 py-2 ${
                    selected
                      ? 'border-primary bg-primary'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <View className="items-center rounded-2xl border border-gray-100 bg-white px-5 py-10">
            <Home size={38} color="#9CA3AF" />

            <Text className="mt-3 text-base font-bold text-gray-800">
              Aucune annonce
            </Text>

            <Text className="mt-1 text-center text-sm text-gray-500">
              Aucune propriété ne correspond à ce filtre.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredListings.map((listing) => (
              <View
                key={listing.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                {/* Image placeholder */}
                <View className="h-36 items-center justify-center bg-green-50">
                  <Home size={48} color="#168F75" />

                  <Text className="mt-2 text-xs text-gray-500">
                    Photo du logement
                  </Text>
                </View>

                {/* Details */}
                <View className="p-4">
                  <View className="mb-2 flex-row items-start justify-between gap-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">
                        {listing.title}
                      </Text>

                      <View className="mt-1 flex-row items-center gap-1">
                        <MapPin size={14} color="#6B7280" />

                        <Text className="text-xs text-gray-500">
                          {listing.neighbourhood}, {listing.city}
                        </Text>
                      </View>
                    </View>

                    <StatusBadge status={listing.status} />
                  </View>

                  <Text className="mb-3 text-xl font-bold text-primary">
                    {listing.rent.toLocaleString('fr-FR')} DH
                    <Text className="text-xs font-normal text-gray-500">
                      {' '} / mois
                    </Text>
                  </Text>

                  <View className="mb-4 flex-row flex-wrap gap-4">
                    <View className="flex-row items-center gap-1">
                      <Maximize size={15} color="#6B7280" />
                      <Text className="text-xs text-gray-600">
                        {listing.surface} m²
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                      <BedDouble size={15} color="#6B7280" />
                      <Text className="text-xs text-gray-600">
                        {listing.bedrooms} chambres
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                      <Bath size={15} color="#6B7280" />
                      <Text className="text-xs text-gray-600">
                        {listing.bathrooms} SDB
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={handleEdit}
                      className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 active:bg-gray-50"
                    >
                      <Pencil size={15} color="#374151" />

                      <Text className="text-sm font-semibold text-gray-700">
                        Modifier
                      </Text>
                    </Pressable>

                    {listing.status !== 'rented' && (
                      <Pressable
                        onPress={() => toggleVisibility(listing.id)}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-green-50 py-3 active:opacity-70"
                      >
                        {listing.status === 'published' ? (
                          <EyeOff size={15} color="#168F75" />
                        ) : (
                          <Eye size={15} color="#168F75" />
                        )}

                        <Text className="text-sm font-semibold text-primary">
                          {listing.status === 'published'
                            ? 'Masquer'
                            : 'Publier'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
