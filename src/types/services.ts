export interface TourismService {
  id: string;
  type: 'accommodation' | 'tour' | 'boat' | 'guide';
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
  maxParticipants?: number;
  // ... other fields
}

// Rest of the file remains the same...