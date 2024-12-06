import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/user';
import toast from 'react-hot-toast';

export function UserTypeSelection() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSelection = async (role: UserType) => {
    try {
      if (!currentUser) return;
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        roles: [role],
        activeRole: role,
        updatedAt: new Date().toISOString()
      });

      toast.success('Perfil configurado com sucesso!');
      navigate(role === 'supplier' ? '/supplier/dashboard' : '/customer/dashboard');
    } catch (error) {
      toast.error('Erro ao configurar perfil. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Como você deseja usar nossa plataforma?
          </h2>
          <p className="mt-2 text-gray-600">
            Você poderá alternar entre os modos depois
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => handleSelection('customer')}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Cliente</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Buscar e reservar serviços turísticos
            </p>
          </button>

          <button
            onClick={() => handleSelection('supplier')}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Building2 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Fornecedor</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Oferecer serviços turísticos
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}