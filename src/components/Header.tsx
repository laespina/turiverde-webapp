import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu as MenuIcon, Search, Globe, User, LogOut, Building2, Heart, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

export function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: '',
    guests: ''
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleAdvertiseClick = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate('/supplier/dashboard');
    }
  };

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
    <header className="fixed w-full top-0 z-50 bg-white border-b">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 md:gap-0">
          {/* Logo */}
          <Link to="/" className="hidden md:block">
            <img src="/assets/logo.png" alt="TuriVerde" className="h-8" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 md:flex-initial md:mx-auto">
            <div className="flex items-center border rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <input
                type="text"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                placeholder="Para onde você vai?"
                className="flex-1 border-none bg-transparent focus:outline-none text-sm font-semibold placeholder-gray-600"
              />
              <div className="hidden sm:block text-sm font-semibold px-4 border-x">
                <input
                  type="date"
                  value={searchParams.dates}
                  onChange={(e) => setSearchParams({ ...searchParams, dates: e.target.value })}
                  className="border-none bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
              <div className="text-sm pl-4 pr-2 text-gray-600 flex items-center gap-3">
                <select
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                  className="border-none bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">Hóspedes</option>
                  <option value="1">1 hóspede</option>
                  <option value="2">2 hóspedes</option>
                  <option value="3">3 hóspedes</option>
                  <option value="4">4+ hóspedes</option>
                </select>
                <button type="submit" className="p-2 bg-primary rounded-full text-white">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAdvertiseClick}
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Anuncie seu espaço
            </Button>

            <button className="hidden md:flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
              <Globe className="h-4 w-4" />
            </button>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-2 border rounded-full hover:shadow-md transition"
              >
                <MenuIcon className="h-4 w-4" />
                <div className="hidden md:block">
                  <User className="h-4 w-4" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border">
                  {!currentUser ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Cadastrar
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={userProfile?.activeRole === 'supplier' ? '/supplier/dashboard' : '/customer/dashboard'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/customer/dashboard/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Favoritos
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Sair
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}