import React, { useState } from 'react';
import { 
  Ship, 
  Users, 
  Ruler, 
  Calendar,
  Anchor,
  Plus,
  X,
  LifeBuoy,
  Compass,
  Navigation,
  Wind,
  Waves,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../ui/button';

interface BoatFormProps {
  formData: any;
  onChange: (data: any) => void;
}

const steps = [
  { id: 1, title: 'Informações Básicas' },
  { id: 2, title: 'Características' },
  { id: 3, title: 'Equipamentos' },
  { id: 4, title: 'Regras e Requisitos' }
];

const boatTypes = [
  { value: 'speedboat', label: 'Lancha', icon: Ship },
  { value: 'sailboat', label: 'Veleiro', icon: Navigation },
  { value: 'yacht', label: 'Iate', icon: Ship },
  { value: 'catamaran', label: 'Catamarã', icon: Ship },
  { value: 'fishing', label: 'Barco de Pesca', icon: Ship },
  { value: 'jetski', label: 'Jet Ski', icon: Ship }
];

const safetyEquipment = [
  { value: 'lifeJackets', label: 'Coletes Salva-vidas', icon: LifeBuoy },
  { value: 'firstAid', label: 'Kit Primeiros Socorros', icon: AlertTriangle },
  { value: 'gps', label: 'GPS', icon: Compass },
  { value: 'radio', label: 'Rádio VHF', icon: Wind },
  { value: 'flares', label: 'Sinalizadores', icon: AlertTriangle },
  { value: 'anchor', label: 'Âncora', icon: Anchor }
];

export function BoatForm({ formData, onChange }: BoatFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (updates: any) => {
    onChange({ ...formData, ...updates });
  };

  const handleEquipmentToggle = (equipment: string) => {
    const currentEquipment = formData.equipment || [];
    const newEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter((e: string) => e !== equipment)
      : [...currentEquipment, equipment];
    updateFormData({ equipment: newEquipment });
  };

  const handleCustomEquipmentAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newEquipment = e.currentTarget.value.trim();
      if (!formData.customEquipment?.includes(newEquipment)) {
        updateFormData({
          customEquipment: [...(formData.customEquipment || []), newEquipment]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${
                step.id === currentStep ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Embarcação
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {boatTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData({ boatType: type.value })}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${formData.boatType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <type.icon className={`
                      h-5 w-5
                      ${formData.boatType === type.value
                        ? 'text-primary'
                        : 'text-gray-400'
                      }
                    `} />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidade de Passageiros
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comprimento (pés)
                </label>
                <div className="mt-1 relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.length || ''}
                    onChange={(e) => updateFormData({ length: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ano de Fabricação
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year || ''}
                    onChange={(e) => updateFormData({ year: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duração do Passeio
                </label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => updateFormData({ duration: e.target.value })}
                    placeholder="Ex: 4 horas"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Características</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motor
                </label>
                <input
                  type="text"
                  value={formData.engine || ''}
                  onChange={(e) => updateFormData({ engine: e.target.value })}
                  placeholder="Ex: 200hp Mercury"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Velocidade Máxima (nós)
                </label>
                <input
                  type="number"
                  value={formData.maxSpeed || ''}
                  onChange={(e) => updateFormData({ maxSpeed: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cabines
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cabins || ''}
                  onChange={(e) => updateFormData({ cabins: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banheiros
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bathrooms || ''}
                  onChange={(e) => updateFormData({ bathrooms: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição das Características
              </label>
              <textarea
                value={formData.features || ''}
                onChange={(e) => updateFormData({ features: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Descreva as características principais da embarcação..."
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Equipamentos de Segurança</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {safetyEquipment.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleEquipmentToggle(item.value)}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                    ${formData.equipment?.includes(item.value)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <item.icon className={`
                    h-5 w-5
                    ${formData.equipment?.includes(item.value)
                      ? 'text-primary'
                      : 'text-gray-400'
                    }
                  `} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamentos Adicionais
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Adicionar equipamento (pressione Enter)"
                    onKeyDown={handleCustomEquipmentAdd}
                    className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  <Plus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {formData.customEquipment?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.customEquipment.map((item: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            const newEquipment = formData.customEquipment.filter(
                              (_: string, i: number) => i !== index
                            );
                            updateFormData({ customEquipment: newEquipment });
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Regras e Requisitos</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requisitos para Locação
              </label>
              <textarea
                value={formData.requirements || ''}
                onChange={(e) => updateFormData({ requirements: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Ex: Habilitação náutica, idade mínima..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Regras de Uso
              </label>
              <textarea
                value={formData.rules || ''}
                onChange={(e) => updateFormData({ rules: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Descreva as regras de uso da embarcação..."
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
          disabled={currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Concluir' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
}