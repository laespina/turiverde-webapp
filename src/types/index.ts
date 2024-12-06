// User types
export type UserRole = 'customer' | 'supplier';

export interface UserProfile {
  id: string;
  email: string;
  roles: UserRole[];
  activeRole?: UserRole;
  name?: string;
  phone?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

// Service types
export type ServiceType = 'accommodation' | 'tour' | 'boat' | 'guide';

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
  price: number;
  priceType?: 'per_person' | 'per_group';
  location: string;
  address: Address;
  images: string[];
  supplierId: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// Chat types
export interface Chat {
  id: string;
  customerId: string;
  supplierId: string;
  serviceId: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  participants: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

// Common types
export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}