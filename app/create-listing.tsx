
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  Check,
  Home,
  ImagePlus,
  MapPin,
  Trash2,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';

type PropertyType = 'apartment' | 'house' | 'studio';

type FormData = {
  title: string;
  description: string;
  propertyType: PropertyType;
  city: string;
  neighbourhood: string;
  exactAddress: string;
  monthlyRent: string;
  monthlyCharges: string;
  deposit: string;
  surfaceArea: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  isFurnished: boolean;
};

const INITIAL_FORM: FormData = {
  title: '',
  description: '',
  propertyType: 'apartment',
  city: '',
  neighbourhood: '',
  exactAddress: '',
  monthlyRent: '',
  monthlyCharges: '0',
  deposit: '0',
  surfaceArea: '',
  bedrooms: '1',
  bathrooms: '1',
  floor: '',
  isFurnished: false,
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-foreground">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl border border-border bg-card px-4 text-foreground ${
          multiline ? 'min-h-28 py-3' : 'h-12'
        }`}
      />
    </View>
  );
}

export default function CreateListingScreen() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [photos, setPhotos] = useState<string[]>([]);

  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function selectPhotos() {
    if (photos.length >= 8) {
      Alert.alert('Limite atteinte', 'Vous pouvez ajouter 8 photos maximum.');
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission nécessaire',
        'Autorisez l’accès à votre galerie pour ajouter des photos.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 8 - photos.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);

      setPhotos((previous) =>
        [...previous, ...selectedUris].slice(0, 8),
      );
    }
  }

  function removePhoto(uri: string) {
    setPhotos((previous) => previous.filter((photo) => photo !== uri));
  }

  function validateForm() {
    if (!form.title.trim()) {
      Alert.alert('Champ obligatoire', 'Veuillez saisir le titre.');
      return;
    }

    if (!form.description.trim()) {
      Alert.alert('Champ obligatoire', 'Veuillez saisir la description.');
      return;
    }

    if (!form.city.trim() || !form.neighbourhood.trim()) {
      Alert.alert('Localisation', 'Veuillez saisir la ville et le quartier.');
      return;
    }

    const rent = Number(form.monthlyRent);
    const surface = Number(form.surfaceArea);

    if (!Number.isFinite(rent) || rent <= 0) {
      Alert.alert('Loyer invalide', 'Saisissez un loyer mensuel valide.');
      return;
    }

    if (!Number.isFinite(surface) || surface <= 0) {
      Alert.alert('Surface invalide', 'Saisissez une surface valide.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Photos obligatoires', 'Ajoutez au moins une photo.');
      return;
    }

    Alert.alert(
      'Formulaire valide',
      'Les informations sont correctement saisies. La sauvegarde sera connectée après la validation du Backend de l’équipe.',
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center border-b border-border px-5 pb-3 pt-12">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 rounded-full bg-secondary p-2"
        >
          <ArrowLeft size={21} color="#173047" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">
            Nouvelle annonce
          </Text>
          <Text className="text-xs text-muted-foreground">
            Présentez votre bien immobilier
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 45 }}
      >
        {/* Photos */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-bold text-foreground">
            Photos du logement
          </Text>

          <Text className="mb-3 text-sm text-muted-foreground">
            Ajoutez jusqu’à 8 photos de bonne qualité.
          </Text>

          <Pressable
            onPress={selectPhotos}
            className="items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-secondary py-7"
          >
            <ImagePlus size={32} color="#168F75" />
            <Text className="mt-2 font-bold text-primary">
              Ajouter des photos
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              {photos.length}/8 photos sélectionnées
            </Text>
          </Pressable>

          {photos.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-3">
              {photos.map((uri) => (
                <View key={uri} className="relative">
                  <Image
                    source={{ uri }}
                    className="h-24 w-24 rounded-xl"
                  />

                  <Pressable
                    onPress={() => removePhoto(uri)}
                    className="absolute right-1 top-1 rounded-full bg-white p-1"
                  >
                    <Trash2 size={15} color="#DC2626" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* General information */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-bold text-foreground">
            Informations générales
          </Text>

          <FormField
            label="Titre de l'annonce *"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Ex : Appartement moderne à louer"
          />

          <FormField
            label="Description *"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Décrivez votre logement..."
            multiline
          />

          <Text className="mb-3 font-semibold text-foreground">
            Type de logement *
          </Text>

          <View className="mb-4 flex-row gap-2">
            {([
              { value: 'apartment', label: 'Appartement' },
              { value: 'house', label: 'Maison' },
              { value: 'studio', label: 'Studio' },
            ] as const).map((item) => {
              const selected = form.propertyType === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => updateField('propertyType', item.value)}
                  className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                    selected
                      ? 'border-primary bg-secondary'
                      : 'border-border bg-card'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selected ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-bold text-foreground">
            Localisation
          </Text>

          <FormField
            label="Ville *"
            value={form.city}
            onChangeText={(value) => updateField('city', value)}
            placeholder="Ex : Oujda"
          />

          <FormField
            label="Quartier *"
            value={form.neighbourhood}
            onChangeText={(value) => updateField('neighbourhood', value)}
            placeholder="Ex : Centre-ville"
          />

          <FormField
            label="Adresse exacte"
            value={form.exactAddress}
            onChangeText={(value) => updateField('exactAddress', value)}
            placeholder="Adresse du logement"
          />
        </View>

        {/* Price */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-bold text-foreground">
            Prix et charges
          </Text>

          <FormField
            label="Loyer mensuel (DH) *"
            value={form.monthlyRent}
            onChangeText={(value) => updateField('monthlyRent', value)}
            placeholder="Ex : 3500"
            keyboardType="decimal-pad"
          />

          <FormField
            label="Charges mensuelles (DH)"
            value={form.monthlyCharges}
            onChangeText={(value) => updateField('monthlyCharges', value)}
            placeholder="0"
            keyboardType="decimal-pad"
          />

          <FormField
            label="Caution (DH)"
            value={form.deposit}
            onChangeText={(value) => updateField('deposit', value)}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Details */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-bold text-foreground">
            Caractéristiques
          </Text>

          <FormField
            label="Surface (m²) *"
            value={form.surfaceArea}
            onChangeText={(value) => updateField('surfaceArea', value)}
            placeholder="Ex : 95"
            keyboardType="decimal-pad"
          />

          <FormField
            label="Nombre de chambres"
            value={form.bedrooms}
            onChangeText={(value) => updateField('bedrooms', value)}
            placeholder="1"
            keyboardType="numeric"
          />

          <FormField
            label="Nombre de salles de bain"
            value={form.bathrooms}
            onChangeText={(value) => updateField('bathrooms', value)}
            placeholder="1"
            keyboardType="numeric"
          />

          <FormField
            label="Étage"
            value={form.floor}
            onChangeText={(value) => updateField('floor', value)}
            placeholder="Ex : 2"
            keyboardType="numeric"
          />

          <Pressable
            onPress={() =>
              updateField('isFurnished', !form.isFurnished)
            }
            className="flex-row items-center justify-between rounded-xl border border-border bg-card p-4"
          >
            <View className="flex-row items-center gap-2">
              <Home size={19} color="#168F75" />
              <Text className="font-semibold text-foreground">
                Logement meublé
              </Text>
            </View>

            <View
              className={`h-6 w-6 items-center justify-center rounded-md border ${
                form.isFurnished
                  ? 'border-primary bg-primary'
                  : 'border-border'
              }`}
            >
              {form.isFurnished && (
                <Check size={16} color="#FFFFFF" />
              )}
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={validateForm}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4"
        >
          <Check size={20} color="#FFFFFF" />
          <Text className="font-bold text-white">
            Valider les informations
          </Text>
        </Pressable>

        <Text className="mt-3 text-center text-xs text-muted-foreground">
          * Champs obligatoires
        </Text>
      </ScrollView>
    </View>
  );
}
