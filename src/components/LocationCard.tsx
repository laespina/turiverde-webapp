import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationCardProps {
  image: string;
  title: string;
  location: string;
  type: 'beach' | 'lodging';
}

export function LocationCard({ image, title, location, type }: LocationCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>
    </div>
  );
}