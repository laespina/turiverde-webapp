import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getFavorites, removeFromFavorites } from '../../services/favorites';
import { TourismService } from '../../types/services';
import toast from 'react-hot-toast';

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<TourismService[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites(currentUser!.uid);
      setFavorites(data);
    } catch (error) {
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (serviceId: string) => {
    try {
      await removeFromFavorites(currentUser!.uid, serviceId);
      setFavorites(favorites.filter(fav => fav.id !== serviceId));
      toast.success('Removido dos favoritos');
    } catch (error) {
      toast.error('Erro ao remover dos favoritos');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Nenhum favorito ainda
        </h2>
        <p className="text-gray-500 mb-4">
          Salve seus lugares favoritos para encontrá-los facilmente depois
        </p>
        <Link 
          to="/"
          className="text-primary hover:underline"
        >
          Explorar serviços
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Meus Favoritos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={service.images[0]}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => handleRemoveFavorite(service.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm"
              >
                <Heart className="h-5 w-5 fill-current text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <Link to={`/services/${service.id}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{service.rating || 'Novo'}</span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {service.description}
                </p>

                <div className="mt-4">
                  <span className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(service.price)}
                  </span>
                  {service.type === 'accommodation' && (
                    <span className="text-gray-500"> /noite</span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}