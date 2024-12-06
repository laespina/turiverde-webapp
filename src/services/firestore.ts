import { 
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TourPackage, Service } from '../types';

// Tours
export const addTour = async (tour: Omit<TourPackage, 'id'>) => {
  const toursRef = collection(db, 'tours');
  return await addDoc(toursRef, tour);
};

export const getTours = async () => {
  const toursRef = collection(db, 'tours');
  const snapshot = await getDocs(toursRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as TourPackage[];
};

export const deleteTour = async (id: string) => {
  const tourRef = doc(db, 'tours', id);
  await deleteDoc(tourRef);
};

// Services
export const addService = async (service: Omit<Service, 'id'>) => {
  const servicesRef = collection(db, 'services');
  return await addDoc(servicesRef, service);
};

export const getServices = async () => {
  const servicesRef = collection(db, 'services');
  const snapshot = await getDocs(servicesRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Service[];
};