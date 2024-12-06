import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, MapPin, Star } from 'lucide-react';
import { searchServices } from '../services/services';
import { TourismService } from '../types/services';
import { Button } from '../components/ui/button';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<TourismService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: '',
    rating: ''
  });

  useEffect(() => {
    loadServices();
  }, [searchParams, filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const results = await searchServices({
        location: searchParams.get('location') || undefined,
        dates: searchParams.get('dates') || undefined,
        guests: searchParams.get('guests') || undefined,
        type: filters.type || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        rating: filters.rating ? Number(filters.rating) : undefined
      });
      setServices(results);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {services.length} {services.length === 1 ? 'resultado' : 'resultados'}
              {searchParams.get('location') && ` em ${searchParams.get('location')}`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {searchParams.get('dates') && `Para ${searchParams.get('dates')}`}
              {searchParams.get('guests') && ` · ${searchParams.get('guests')} hóspedes`}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de preço
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Mín"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Máx"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de serviço
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Todos os tipos</option>
                  <option value="accommodation">Hospedagem</option>
                  <option value="tour">Passeio</option>
                  <option value="boat">Embarcação</option>
                  <option value="guide">Guia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação mínima
                </label>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Qualquer avaliação</option>
                  <option value="4">4+ estrelas</option>
                  <option value="4.5">4.5+ estrelas</option>
                  <option value="4.8">4.8+ estrelas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou buscar por outra localização
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to favorites logic here
                    }}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{service.rating || 'Novo'}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="mt-4">
                    <span className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(service.price)}
                    </span>
                    {service.type === 'accommodation' && (
                      <span className="text-gray-500"> /noite</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}