type VisitStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

type Visit = {
  id: string;
  listingId: string;
  tenantId: string;
  ownerId: string;
  startsAt: string;
  endsAt: string;
  message: string | null;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
};

export type { Visit, VisitStatus };
