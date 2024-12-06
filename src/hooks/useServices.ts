import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Service } from '../types';

export function useServices(supplierId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const constraints = [orderBy('createdAt', 'desc'), limit(50)];
        
        if (supplierId) {
          constraints.push(where('supplierId', '==', supplierId));
        }
        
        const q = query(servicesRef, ...constraints);
        const snapshot = await getDocs(q);
        
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [supplierId]);

  return { services, loading };
}