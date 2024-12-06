import React, { useState } from 'react';
import { Building2, MapPin, Ship, UserCog } from 'lucide-react';
import { ServicesList } from '../../../components/services/ServicesList';
import { ServiceModal } from '../../../components/services/ServiceModal';
import { TourismService } from '../../../types/services';

const serviceTypes = [
  { 
    type: 'accommodation',
    icon: Building2,
    title: 'Hospedagem',
    description: 'Hotéis, pousadas, casas e apartamentos',
    color: 'blue'
  },
  { 
    type: 'tour',
    icon: MapPin,
    title: 'Passeio',
    description: 'Tours, excursões e experiências',
    color: 'green'
  },
  { 
    type: 'boat',
    icon: Ship,
    title: 'Embarcação',
    description: 'Barcos, lanchas e passeios náuticos',
    color: 'purple'
  },
  { 
    type: 'guide',
    icon: UserCog,
    title: 'Guia Turístico',
    description: 'Serviços de guia e acompanhamento',
    color: 'orange'
  }
];

export function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<TourismService | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleAddService = (type: string) => {
    setSelectedService(null);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleEditService = (service: TourismService) => {
    setSelectedService(service);
    setSelectedType(service.type);
    setIsModalOpen(true);
  };

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 group-hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 hover:bg-green-100 group-hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 group-hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 group-hover:bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Serviços</h1>
        <p className="mt-1 text-sm text-gray-500">
          Escolha o tipo de serviço que deseja cadastrar
        </p>
      </div>

      {/* Service Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceTypes.map((service) => (
          <button
            key={service.type}
            onClick={() => handleAddService(service.type)}
            className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${getColorClass(service.color)}`}>
                <service.icon className="h-6 w-6" />
              </div>
              
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              
              <p className="mt-2 text-sm text-gray-500">
                {service.description}
              </p>
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary rounded-xl transition-colors" />
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            Seus Serviços
          </h2>
        </div>
        <ServicesList onEdit={handleEditService} />
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedType(null);
          }}
          service={selectedService}
          initialType={selectedType}
        />
      )}
    </div>
  );
}