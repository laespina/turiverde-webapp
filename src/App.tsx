import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { UserTypeSelection } from './pages/UserTypeSelection';
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';
import { Dashboard } from './pages/supplier/Dashboard';
import { ServicesPage } from './pages/supplier/services/ServicesPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { FavoritesPage } from './pages/customer/FavoritesPage';
import { Home } from './pages/Home';
import { ServiceDetail } from './pages/ServiceDetail';
import { SearchResults } from './pages/SearchResults';
import { ChatPage } from './pages/chat/ChatPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/search" element={<><Header /><SearchResults /></>} />
          <Route path="/services/:id" element={<><Header /><ServiceDetail /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/select-type" element={<ProtectedRoute><UserTypeSelection /></ProtectedRoute>} />
          
          {/* Supplier routes */}
          <Route path="/supplier/dashboard" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="calendar" element={<div>Calendário</div>} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="finance" element={<div>Financeiro</div>} />
            <Route path="profile" element={<div>Meus Dados</div>} />
          </Route>

          {/* Customer routes */}
          <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>}>
            <Route index element={<div>Bem-vindo ao painel do cliente!</div>} />
            <Route path="bookings" element={<div>Minhas Reservas</div>} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;