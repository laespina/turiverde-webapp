import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Package,
  MessageSquare
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Total de Reservas', value: '156', icon: Calendar, trend: '+12.5%' },
    { label: 'Novos Clientes', value: '32', icon: Users, trend: '+4.3%' },
    { label: 'Faturamento', value: 'R$ 12.450', icon: DollarSign, trend: '+8.2%' },
    { label: 'Taxa de Ocupação', value: '78%', icon: TrendingUp, trend: '+2.4%' },
  ];

  const recentBookings = [
    { id: 1, customer: 'João Silva', service: 'Tour Praias', date: '2024-03-15', status: 'confirmed' },
    { id: 2, customer: 'Maria Santos', service: 'Passeio de Barco', date: '2024-03-16', status: 'pending' },
    { id: 3, customer: 'Pedro Costa', service: 'City Tour', date: '2024-03-17', status: 'confirmed' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 font-medium">{stat.trend}</span>
              <span className="text-gray-500 ml-2">vs. último mês</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Novo Serviço</h3>
            <p className="text-sm text-gray-500">Adicionar novo serviço</p>
          </div>
        </button>

        <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Agenda</h3>
            <p className="text-sm text-gray-500">Ver compromissos</p>
          </div>
        </button>

        <button className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Mensagens</h3>
            <p className="text-sm text-gray-500">Ver conversas</p>
          </div>
        </button>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Reservas Recentes</h2>
        </div>
        <div className="divide-y">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium">{booking.customer}</p>
                <p className="text-sm text-gray-500">{booking.service}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}