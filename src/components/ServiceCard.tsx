import React from 'react';
import { Service } from '../types';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = (Icons as any)[service.icon];

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="p-3 bg-[#E6F7F6] rounded-full group-hover:bg-[#00A699] transition-colors">
        <Icon className="h-6 w-6 text-[#00A699] group-hover:text-white transition-colors" />
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{service.name}</h3>
    </div>
  );
}