import React, { useState } from 'react';
import { 
  Globe, 
  Award, 
  Clock, 
  Plus, 
  X, 
  MapPin, 
  Users,
  Calendar,
  DollarSign,
  Camera,
  Briefcase,
  GraduationCap,
  Heart,
  Flag
} from 'lucide-react';
import { Button } from '../../ui/button';

interface GuideFormProps {
  formData: any;
  onChange: (data: any) => void;
}

const steps = [
  { id: 1, title: 'Identificação' },
  { id: 2, title: 'Qualificações' },
  { id: 3, title: 'Serviços' },
  { id: 4, title: 'Preço e Disponibilidade' }
];

const languages = [
  'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 
  'Italiano', 'Mandarim', 'Japonês', 'Coreano', 'Russo'
];

const specialties = [
  'Turismo Cultural',
  'Ecoturismo',
  'Turismo de Aventura',
  'Turismo Gastronômico',
  'Turismo Histórico',
  'Fotografia',
  'Turismo Religioso',
  'Turismo de Compras',
  'Vida Noturna',
  'Turismo Rural'
];

export function GuideForm({ formData, onChange }: GuideFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (updates: any) => {
    onChange({ ...formData, ...updates });
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = formData.languages || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l: string) => l !== language)
      : [...currentLanguages, language];
    updateFormData({ languages: newLanguages });
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = formData.specialties || [];
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter((s: string) => s !== specialty)
      : [...currentSpecialties, specialty];
    updateFormData({ specialties: newSpecialties });
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Anos de Experiência
                </label>
                <div className="mt-1 relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.experience || ''}
                    onChange={(e) => updateFormData({ experience: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Anos de experiência"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registro de Guia (CADASTUR)
                </label>
                <div className="mt-1 relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.registrationNumber || ''}
                    onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Número do registro"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Biografia
                </label>
                <textarea
                  value={formData.biography || ''}
                  onChange={(e) => updateFormData({ biography: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                  placeholder="Conte um pouco sobre sua experiência e paixão pelo turismo..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Qualificações</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idiomas
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${formData.languages?.includes(language)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Globe className={`
                      h-4 w-4
                      ${formData.languages?.includes(language)
                        ? 'text-primary'
                        : 'text-gray-400'
                      }
                    `} />
                    <span className="text-sm">{language}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidades
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${formData.specialties?.includes(specialty)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Flag className={`
                      h-4 w-4
                      ${formData.specialties?.includes(specialty)
                        ? 'text-primary'
                        : 'text-gray-400'
                      }
                    `} />
                    <span className="text-sm">{specialty}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formação e Certificações
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.education || ''}
                    onChange={(e) => updateFormData({ education: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Formação acadêmica"
                  />
                </div>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.certifications || ''}
                    onChange={(e) => updateFormData({ certifications: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Certificações relevantes"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Serviços Oferecidos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duração Média dos Tours
                </label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.tourDuration || ''}
                    onChange={(e) => updateFormData({ tourDuration: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Ex: 4 horas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tamanho Máximo do Grupo
                </label>
                <div className="mt-1 relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.maxGroupSize || ''}
                    onChange={(e) => updateFormData({ maxGroupSize: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                    placeholder="Número máximo de pessoas"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição dos Serviços
                </label>
                <textarea
                  value={formData.servicesDescription || ''}
                  onChange={(e) => updateFormData({ servicesDescription: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                  placeholder="Descreva os serviços que você oferece..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  O que está Incluído
                </label>
                <textarea
                  value={formData.includedServices || ''}
                  onChange={(e) => updateFormData({ includedServices: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                  placeholder="Liste o que está incluído nos seus serviços..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Preço e Disponibilidade</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preço por Hora
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
                    placeholder="Valor por hora"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disponibilidade Semanal
                </label>
                <div className="mt-2 space-y-2">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability?.includes(day)}
                        onChange={(e) => {
                          const current = formData.availability || [];
                          const updated = e.target.checked
                            ? [...current, day]
                            : current.filter((d: string) => d !== day);
                          updateFormData({ availability: updated });
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Horários Disponíveis
                </label>
                <div className="mt-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500">Início</label>
                      <input
                        type="time"
                        value={formData.startTime || ''}
                        onChange={(e) => updateFormData({ startTime: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Fim</label>
                      <input
                        type="time"
                        value={formData.endTime || ''}
                        onChange={(e) => updateFormData({ endTime: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Política de Cancelamento
                </label>
                <textarea
                  value={formData.cancellationPolicy || ''}
                  onChange={(e) => updateFormData({ cancellationPolicy: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:ring-offset-2 focus:border-primary"
                  placeholder="Descreva sua política de cancelamento..."
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
          disabled={currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Concluir' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
}