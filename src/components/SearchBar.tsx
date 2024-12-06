import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: '',
    guests: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchParams.location) {
      params.append('location', searchParams.location);
    }
    
    if (searchParams.dates) {
      params.append('dates', searchParams.dates);
    }
    
    if (searchParams.guests) {
      params.append('guests', searchParams.guests);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-[850px] mx-auto">
      <div className="flex flex-col md:flex-row bg-white rounded-full shadow-lg divide-y md:divide-y-0 md:divide-x border">
        {/* Location */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-xs font-bold">Onde</label>
              <input
                type="text"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                placeholder="Para onde você vai?"
                className="w-full border-none p-0 focus:ring-0 text-sm placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-xs font-bold">Check-in - Checkout</label>
              <input
                type="text"
                value={searchParams.dates}
                onChange={(e) => setSearchParams({ ...searchParams, dates: e.target.value })}
                placeholder="Adicione datas"
                className="w-full border-none p-0 focus:ring-0 text-sm placeholder-gray-400"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
              />
            </div>
          </div>
        </div>

        {/* Guests & Search Button */}
        <div className="flex items-center p-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Users className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-xs font-bold">Quem</label>
              <select
                value={searchParams.guests}
                onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                className="w-full border-none p-0 focus:ring-0 text-sm bg-transparent"
              >
                <option value="">Selecione</option>
                <option value="1">1 hóspede</option>
                <option value="2">2 hóspedes</option>
                <option value="3">3 hóspedes</option>
                <option value="4">4+ hóspedes</option>
              </select>
            </div>
          </div>
          
          <Button type="submit" className="px-6 py-3 rounded-full">
            <Search className="h-4 w-4" />
            <span className="ml-2 hidden md:inline">Buscar</span>
          </Button>
        </div>
      </div>
    </form>
  );
}