import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  DollarSign,
  Calendar,
  Camera,
  Compass,
  Mountain,
  Sunrise,
  Sunset
} from 'lucide-react';
import { Button } from '../../ui/button';

interface TourFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export function TourForm({ formData, onChange }: TourFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateFormData = (updates: any) => {
    onChange({ ...formData, ...updates });
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
                {index + 1 === 1 && 'Informações Básicas'}
                {index + 1 === 2 && 'Detalhes do Tour'}
                {index + 1 === 3 && 'Itinerário'}
                {index + 1 === 4 && 'Regras e Políticas'}
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
            <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Preço
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateFormData({ priceType: 'per_person' })}
                    className={`
                      flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${formData.priceType === 'per_person'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Users className={`
                      h-5 w-5
                      ${formData.priceType === 'per_person' ? 'text-primary' : 'text-gray-400'}
                    `} />
                    <span className="text-sm font-medium">Por Pessoa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFormData({ priceType: 'per_group' })}
                    className={`
                      flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                      ${formData.priceType === 'per_group'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Users className={`
                      h-5 w-5
                      ${formData.priceType === 'per_group' ? 'text-primary' : 'text-gray-400'}
                    `} />
                    <span className="text-sm font-medium">Por Grupo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => updateFormData({ price: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder={`Valor ${formData.priceType === 'per_person' ? 'por pessoa' : 'por grupo'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duração
                </label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => updateFormData({ duration: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Ex: 4 horas"
                  />
                </div>
              </div>

              {formData.priceType === 'per_group' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Máximo de Participantes
                  </label>
                  <div className="mt-1 relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipants || ''}
                      onChange={(e) => updateFormData({ maxParticipants: e.target.value })}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Número máximo de pessoas"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Detalhes do Tour</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ponto de Encontro
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.meetingPoint || ''}
                    onChange={(e) => updateFormData({ meetingPoint: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Local de encontro"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horário de Início
                </label>
                <div className="mt-1 relative">
                  <Sunrise className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.startTime || ''}
                    onChange={(e) => updateFormData({ startTime: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  O que está Incluído
                </label>
                <textarea
                  value={formData.included || ''}
                  onChange={(e) => updateFormData({ included: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Liste o que está incluído no tour..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  O que Trazer
                </label>
                <textarea
                  value={formData.toBring || ''}
                  onChange={(e) => updateFormData({ toBring: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Liste o que os participantes devem trazer..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Itinerário</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Roteiro Detalhado
                </label>
                <textarea
                  value={formData.itinerary || ''}
                  onChange={(e) => updateFormData({ itinerary: e.target.value })}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Descreva o roteiro completo do tour..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pontos de Interesse
                </label>
                <textarea
                  value={formData.highlights || ''}
                  onChange={(e) => updateFormData({ highlights: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Liste os principais pontos turísticos..."
                />
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
                  Requisitos
                </label>
                <textarea
                  value={formData.requirements || ''}
                  onChange={(e) => updateFormData({ requirements: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Liste os requisitos para participar do tour..."
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observações Importantes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => updateFormData({ notes: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Adicione informações importantes..."
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
          {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
}