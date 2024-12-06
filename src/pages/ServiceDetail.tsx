import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  DollarSign,
  MessageSquare,
  User,
  Clock,
  Building2,
  Ship,
  UserCog
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServiceById } from '../services/services';
import { getUserProfile } from '../services/users';
import { TourismService } from '../types/services';
import { UserProfile } from '../types/user';
import { createChat } from '../services/chat';
import { Button } from '../components/ui/button';
import { FavoriteButton } from '../components/FavoriteButton';
import { ChatModal } from '../components/chat/ChatModal';
import toast from 'react-hot-toast';

const serviceTypeIcons = {
  accommodation: Building2,
  tour: MapPin,
  boat: Ship,
  guide: UserCog
};

const serviceTypeLabels = {
  accommodation: 'Hospedagem',
  tour: 'Passeio',
  boat: 'Embarcação',
  guide: 'Guia'
};

export function ServiceDetail() {
  const [service, setService] = useState<TourismService | null>(null);
  const [supplier, setSupplier] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      const data = await getServiceById(serviceId);
      setService(data);
      
      if (data?.supplierId) {
        const supplierData = await getUserProfile(data.supplierId);
        setSupplier(supplierData);
      }
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Erro ao carregar serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupplier = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!service) return;

    try {
      const chat = await createChat(currentUser.uid, service.supplierId, service.id);
      setChatId(chat.id);
      setShowChat(true);
    } catch (error) {
      toast.error('Erro ao iniciar conversa');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">Serviço não encontrado</h2>
      </div>
    );
  }

  const ServiceIcon = serviceTypeIcons[service.type as keyof typeof serviceTypeIcons];
  const serviceLabel = serviceTypeLabels[service.type as keyof typeof serviceTypeLabels];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-900">Início</a>
          <span>/</span>
          <span>{service.location}</span>
          <span>/</span>
          <span className="text-gray-900">{service.name}</span>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-2 row-span-2">
            <img
              src={service.images[0]}
              alt={service.name}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(service.images[0])}
            />
          </div>
          <div className="grid grid-cols-2 col-span-2 gap-4">
            {service.images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${service.name} ${index + 2}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                <FavoriteButton serviceId={service.id} />
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <ServiceIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{serviceLabel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{service.location}</span>
                </div>
                {service.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Sobre</h2>
              <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
            </div>

            {/* Features */}
            {service.type === 'accommodation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ServiceIcon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Regras</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {service.type === 'accommodation' && (
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium">{service.checkIn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium">{service.checkOut}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {service.rules && (
                    <div>
                      <h3 className="font-medium mb-2">Regras da casa</h3>
                      <p className="text-gray-600 whitespace-pre-line">{service.rules}</p>
                    </div>
                  )}
                  
                  {service.cancellationPolicy && (
                    <div>
                      <h3 className="font-medium mb-2">Política de cancelamento</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {service.cancellationPolicy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(service.price)}
                </span>
                {service.type === 'accommodation' && (
                  <span className="text-gray-500">/ noite</span>
                )}
                {service.type === 'tour' && service.priceType === 'per_person' && (
                  <span className="text-gray-500">/ pessoa</span>
                )}
              </div>

              <Button
                onClick={handleContactSupplier}
                className="w-full mb-4"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Entrar em contato
              </Button>

              {service.type === 'accommodation' && (
                <div className="text-sm text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Estadia mínima: {service.minStay} noites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Capacidade: {service.capacity} pessoas</span>
                  </div>
                </div>
              )}
            </div>

            {/* Host Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Conheça seu anfitrião</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">
                    {supplier?.name || `Anfitrião #${service.supplierId.slice(0, 8)}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Membro desde {new Date(supplier?.createdAt || '').getFullYear()}
                  </p>
                </div>
              </div>

              {supplier?.biography && (
                <p className="text-gray-600 text-sm">{supplier.biography}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatId && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          chatId={chatId}
          recipientId={service.supplierId}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}