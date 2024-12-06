import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TourismService } from '../../types/services';
import { useAuth } from '../../contexts/AuthContext';
import { addService, updateService } from '../../services/services';
import { ImageUpload } from '../ImageUpload';
import { Button } from '../ui/button';
import { AccommodationForm } from './forms/AccommodationForm';
import { TourForm } from './forms/TourForm';
import { BoatForm } from './forms/BoatForm';
import { GuideForm } from './forms/GuideForm';
import { AddressForm } from '../AddressForm';
import toast from 'react-hot-toast';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: TourismService | null;
  initialType?: string;
}

const serviceTypes = [
  { value: 'accommodation', label: 'Hospedagem' },
  { value: 'tour', label: 'Passeio' },
  { value: 'boat', label: 'Embarcação' },
  { value: 'guide', label: 'Guia Turístico' }
];

export function ServiceModal({ isOpen, onClose, service, initialType }: ServiceModalProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: initialType || 'accommodation',
    name: '',
    description: '',
    price: '',
    location: '',
    images: [] as string[],
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    supplierId: currentUser?.uid || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (service) {
      setFormData({
        ...formData,
        ...service
      });
    } else {
      resetForm();
    }
  }, [service, initialType]);

  const resetForm = () => {
    setFormData({
      type: initialType || 'accommodation',
      name: '',
      description: '',
      price: '',
      location: '',
      images: [],
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      },
      supplierId: currentUser?.uid || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Validate required address fields
    const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !formData.address[field]);
    
    if (missingFields.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios do endereço');
      return;
    }

    try {
      setLoading(true);
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        supplierId: currentUser.uid,
        updatedAt: new Date().toISOString(),
        location: `${formData.address.city}, ${formData.address.state}`
      };

      if (service) {
        await updateService(service.id, serviceData);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await addService(serviceData);
        toast.success('Serviço criado com sucesso!');
      }

      onClose();
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar serviço');
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const handleAddressChange = (address: any) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
  };

  const renderServiceForm = () => {
    switch (formData.type) {
      case 'accommodation':
        return <AccommodationForm formData={formData} onChange={setFormData} />;
      case 'tour':
        return <TourForm formData={formData} onChange={setFormData} />;
      case 'boat':
        return <BoatForm formData={formData} onChange={setFormData} />;
      case 'guide':
        return <GuideForm formData={formData} onChange={setFormData} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {service ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Serviço
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                    disabled={!!service}
                  >
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome do Serviço
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="mt-1 block w-full pl-12 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Form */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
                  <AddressForm
                    value={formData.address}
                    onChange={handleAddressChange}
                  />
                </div>

                {/* Service-specific form */}
                {renderServiceForm()}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens
                  </label>
                  <ImageUpload onUploadComplete={handleImageUpload} folder="services" />
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : service ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}