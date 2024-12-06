import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TourCard } from '../components/TourCard';
import { getAllServices } from '../services/services';
import { TourismService } from '../types/services';
import { FavoriteButton } from '../components/FavoriteButton';
import { MapPin, Star } from 'lucide-react';

export function Home() {
  const [services, setServices] = useState<TourismService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5)' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 max-w-2xl">
            Descubra experiências únicas em todo o Brasil
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {services.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <FavoriteButton serviceId={service.id} />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium">{service.location}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{service.rating || 'Novo'}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">{service.name}</p>
                    
                    <p className="mt-2">
                      <span className="font-semibold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.price)}
                      </span>
                      {service.type === 'accommodation' && (
                        <span className="text-gray-500"> /noite</span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}