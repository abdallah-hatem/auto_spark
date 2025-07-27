import { UserRole } from '@/common/enums/user.enum';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  isAvailable?: boolean;
  address?: string;
  lat?: number;
  lng?: number;
  deviceToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
