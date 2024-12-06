export type UserType = 'customer' | 'supplier';

export interface UserProfile {
  id: string;
  email: string;
  roles: UserType[];
  activeRole?: UserType;
  name?: string;
  phone?: string;
  address?: string;
}