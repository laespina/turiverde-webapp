import { 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAt,
  endAt,
  QueryConstraint,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  limit,
  documentId
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TourismService } from '../types/services';

// Cache for service data
const serviceCache = new Map<string, { data: TourismService; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const searchServices = async (params: {
  location?: string;
  dates?: string;
  guests?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}) => {
  try {
    const servicesRef = collection(db, 'services');
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(50) // Limit results for better performance
    ];

    if (params.type) {
      constraints.push(where('type', '==', params.type));
    }

    if (params.minPrice) {
      constraints.push(where('price', '>=', params.minPrice));
    }

    if (params.maxPrice) {
      constraints.push(where('price', '<=', params.maxPrice));
    }

    if (params.guests) {
      constraints.push(where('capacity', '>=', parseInt(params.guests)));
    }

    if (params.location) {
      const locationLower = params.location.toLowerCase();
      constraints.push(orderBy('location'));
      constraints.push(startAt(locationLower));
      constraints.push(endAt(locationLower + '\uf8ff'));
    }

    const q = query(servicesRef, ...constraints);
    const snapshot = await getDocs(q);

    let services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourismService[];

    if (params.rating) {
      services = services.filter(service => 
        (service.rating || 0) >= (params.rating || 0)
      );
    }

    return services;
  } catch (error) {
    console.error('Error searching services:', error);
    throw error;
  }
};

export const getServiceById = async (id: string) => {
  try {
    // Check cache first
    const cached = serviceCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const serviceDoc = await getDoc(doc(db, 'services', id));
    if (!serviceDoc.exists()) return null;

    const service = { id: serviceDoc.id, ...serviceDoc.data() } as TourismService;
    
    // Update cache
    serviceCache.set(id, { data: service, timestamp: Date.now() });
    
    return service;
  } catch (error) {
    console.error('Error getting service:', error);
    throw error;
  }
};

export const getServices = async (supplierId: string) => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where('supplierId', '==', supplierId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourismService[];
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

export const addService = async (service: Omit<TourismService, 'id'>) => {
  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, service);
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const updateService = async (id: string, service: Partial<TourismService>) => {
  try {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      ...service,
      updatedAt: new Date().toISOString()
    });
    
    // Invalidate cache
    serviceCache.delete(id);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string) => {
  try {
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
    
    // Invalidate cache
    serviceCache.delete(id);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const getAllServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourismService[];
  } catch (error) {
    console.error('Error getting all services:', error);
    throw error;
  }
};