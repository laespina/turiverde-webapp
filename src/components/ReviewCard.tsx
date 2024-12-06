import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
}

export function ReviewCard({ name, location, date, rating, comment }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      <p className="text-gray-600">{comment}</p>
    </div>
  );
}