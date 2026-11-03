type ReportReason = 'fake_listing' | 'misleading_price' | 'incorrect_photos' | 'other';

type ReportStatus = 'pending' | 'dismissed' | 'listing_hidden';

type Report = {
  id: string;
  listingId: string;
  reporterId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  moderationReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type { Report, ReportReason, ReportStatus };
