import React from 'react';
import { TourPackage } from '../types';
import { Star, Users } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

interface TourCardProps {
  tour: TourPackage;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={tour.image}
          alt={tour.title}
          className="object-cover w-full h-full group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton serviceId={tour.id} />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium">{tour.location}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span>{tour.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">{tour.title}</p>
        <p className="text-sm text-gray-500">{tour.duration}</p>
        
        <div className="mt-2 flex items-center gap-1">
          <span className="font-semibold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(tour.price)}
          </span>
          <span className="text-gray-500">
            {tour.priceType === 'per_person' ? ' por pessoa' : ' por grupo'}
          </span>
          {tour.priceType === 'per_group' && (
            <div className="flex items-center gap-1 ml-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>até {tour.maxParticipants} pessoas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}