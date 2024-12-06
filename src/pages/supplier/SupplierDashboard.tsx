import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  User,
  Menu,
  X,
  Plane,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export function SupplierDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToCustomer = async () => {
    try {
      await switchRole('customer');
      navigate('/customer/dashboard');
      toast.success('Modo cliente ativado');
    } catch (error) {
      toast.error('Erro ao trocar de perfil');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Homepage', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/supplier/dashboard' },
    { icon: Package, label: 'Serviços', path: '/supplier/dashboard/services' },
    { icon: Calendar, label: 'Calendário', path: '/supplier/dashboard/calendar' },
    { icon: MessageSquare, label: 'Chat', path: '/supplier/dashboard/chat' },
    { icon: DollarSign, label: 'Financeiro', path: '/supplier/dashboard/finance' },
    { icon: User, label: 'Meus Dados', path: '/supplier/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo area */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link to="/supplier/dashboard" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="TuriVerde" className="h-8 w-auto" />
              <span className="font-semibold text-xl text-gray-900">TuriVerde</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary group"
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Role switcher */}
          <div className="p-4 border-t">
            <button
              onClick={handleSwitchToCustomer}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
            >
              <Plane className="h-5 w-5 mr-3" />
              Vou viajar
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - Now sticky */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}