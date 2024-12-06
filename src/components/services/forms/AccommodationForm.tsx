import React, { useState } from 'react';
import { 
  Home, 
  DoorOpen, 
  Users, 
  Bed, 
  Bath,
  Wifi,
  Car,
  Coffee,
  Wind,
  Tv,
  Waves,
  Utensils,
  Plus,
  X,
  Building2,
  Hotel,
  Home as HomeIcon,
  Building,
  Warehouse,
  Castle
} from 'lucide-react';
import { Button } from '../../ui/button';

interface AccommodationFormProps {
  formData: any;
  onChange: (data: any) => void;
}

const accommodationTypes = [
  { value: 'house', label: 'Casa', icon: HomeIcon },
  { value: 'apartment', label: 'Apartamento', icon: Building2 },
  { value: 'hotel', label: 'Hotel', icon: Hotel },
  { value: 'hostel', label: 'Hostel', icon: Building },
  { value: 'pousada', label: 'Pousada', icon: Warehouse },
  { value: 'resort', label: 'Resort', icon: Castle },
];

const amenities = [
  { value: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { value: 'parking', label: 'Estacionamento', icon: Car },
  { value: 'breakfast', label: 'Café da manhã', icon: Coffee },
  { value: 'ac', label: 'Ar-condicionado', icon: Wind },
  { value: 'tv', label: 'TV', icon: Tv },
  { value: 'pool', label: 'Piscina', icon: Waves },
  { value: 'kitchen', label: 'Cozinha', icon: Utensils },
];

export function AccommodationForm({ formData, onChange }: AccommodationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateFormData = (updates: any) => {
    onChange({ ...formData, ...updates });
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    updateFormData({ amenities: newAmenities });
  };

  const handleCustomAmenityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newAmenity = e.currentTarget.value.trim();
      if (!formData.amenities?.includes(newAmenity)) {
        updateFormData({
          amenities: [...(formData.amenities || []), newAmenity]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index + 1 === currentStep ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-sm font-medium">
                {index + 1 === 1 && 'Identificação'}
                {index + 1 === 2 && 'Configuração'}
                {index + 1 === 3 && 'Comodidades'}
                {index + 1 === 4 && 'Regras'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Tipo de Hospedagem</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accommodationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateFormData({ accommodationType: type.value })}
                  className={`
                    flex flex-col items-center p-4 rounded-lg border-2 transition-all
                    ${formData.accommodationType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <type.icon className={`
                    h-6 w-6 mb-2
                    ${formData.accommodationType === type.value
                      ? 'text-primary'
                      : 'text-gray-400'
                    }
                  `} />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Configuração do Espaço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quartos
                </label>
                <div className="mt-1 relative">
                  <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.rooms || ''}
                    onChange={(e) => updateFormData({ rooms: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banheiros
                </label>
                <div className="mt-1 relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms || ''}
                    onChange={(e) => updateFormData({ bathrooms: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidade de Hóspedes
                </label>
                <div className="mt-1 relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity || ''}
                    onChange={(e) => updateFormData({ capacity: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Comodidades</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenities.map((amenity) => (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.value)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                    ${formData.amenities?.includes(amenity.value)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <amenity.icon className={`
                    h-5 w-5
                    ${formData.amenities?.includes(amenity.value)
                      ? 'text-primary'
                      : 'text-gray-400'
                    }
                  `} />
                  <span className="text-sm font-medium">{amenity.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar outras comodidades
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite e pressione Enter para adicionar..."
                  onKeyDown={handleCustomAmenityAdd}
                  className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
                <Plus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Regras e Políticas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário de Check-in
                </label>
                <input
                  type="time"
                  value={formData.checkIn || ''}
                  onChange={(e) => updateFormData({ checkIn: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário de Check-out
                </label>
                <input
                  type="time"
                  value={formData.checkOut || ''}
                  onChange={(e) => updateFormData({ checkOut: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Regras da Casa
                </label>
                <textarea
                  value={formData.rules || ''}
                  onChange={(e) => updateFormData({ rules: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Descreva as regras da casa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Política de Cancelamento
                </label>
                <textarea
                  value={formData.cancellationPolicy || ''}
                  onChange={(e) => updateFormData({ cancellationPolicy: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Descreva a política de cancelamento..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          disabled={currentStep === totalSteps}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}