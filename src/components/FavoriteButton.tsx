import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkIsFavorite, addToFavorites, removeFromFavorites } from '../services/favorites';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  serviceId: string;
}

export function FavoriteButton({ serviceId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      checkFavoriteStatus();
    }
  }, [currentUser, serviceId]);

  const checkFavoriteStatus = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const status = await checkIsFavorite(currentUser.uid, serviceId);
      setIsFavorite(status);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      if (isFavorite) {
        await removeFromFavorites(currentUser.uid, serviceId);
        toast.success('Removido dos favoritos');
      } else {
        await addToFavorites(currentUser.uid, serviceId);
        toast.success('Adicionado aos favoritos');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error('Erro ao atualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        p-2 rounded-full transition-all duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isFavorite ? 'bg-red-50' : 'bg-white/90 hover:bg-white'}
        shadow-sm
      `}
    >
      <Heart 
        className={`
          h-5 w-5 transition-colors
          ${isFavorite ? 'fill-current text-red-500' : 'text-gray-600'}
        `}
      />
    </button>
  );
}