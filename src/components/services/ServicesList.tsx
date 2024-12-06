import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Sailboat,
  UserCog,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  Users,
  DollarSign,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getServices, deleteService } from '../../services/services';
import { TourismService } from '../../types/services';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

interface ServicesListProps {
  onEdit: (service: TourismService) => void;
}

const serviceIcons = {
  accommodation: Building2,
  tour: MapPin,
  boat: Sailboat,
  guide: UserCog
};

const serviceLabels = {
  accommodation: 'Hospedagem',
  tour: 'Passeio',
  boat: 'Embarcação',
  guide: 'Guia'
};

export function ServicesList({ onEdit }: ServicesListProps) {
  const [services, setServices] = useState<TourismService[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadServices();
    }
  }, [currentUser]);

  const loadServices = async () => {
    try {
      const data = await getServices(currentUser!.uid);
      setServices(data);
    } catch (error) {
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await deleteService(id);
      setServices(services.filter(service => service.id !== id));
      toast.success('Serviço excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir serviço');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum serviço cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {services.map((service) => {
        const Icon = serviceIcons[service.type as keyof typeof serviceIcons];
        const label = serviceLabels[service.type as keyof typeof serviceLabels];

        return (
          <div key={service.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-600" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {label}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                    
                    {service.capacity && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{service.capacity} pessoas</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(service.price)}
                        {service.type === 'accommodation' && ' /noite'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  to={`/services/${service.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
                
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}