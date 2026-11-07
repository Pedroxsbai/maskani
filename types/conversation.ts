type Conversation = {
  id: string;
  listingId: string;
  tenantId: string;
  ownerId: string;
  lastMessageAt: string | null;
  createdAt: string;
};

export type { Conversation };
