type UserRole = 'user' | 'admin';

type UserStatus = 'active' | 'suspended';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  suspensionReason: string | null;
  ownerModeEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type { User, UserRole, UserStatus };
