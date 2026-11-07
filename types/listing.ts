type PropertyType = 'apartment' | 'house' | 'studio';

type ListingStatus = 'draft' | 'published' | 'rented' | 'hidden' | 'deleted';

type Listing = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  city: string;
  neighbourhood: string;
  exactAddress: string;
  latitude: number | null;
  longitude: number | null;
  monthlyRent: number;
  monthlyCharges: number;
  deposit: number;
  surfaceArea: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  isFurnished: boolean;
  photoUrls: string[];
  status: ListingStatus;
  hiddenReason: string | null;
  createdAt: string;
  updatedAt: string;
};

type PublicListing = Omit<Listing, 'exactAddress'>;

export type { Listing, ListingStatus, PropertyType, PublicListing };
