import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/user';

export function RoleSwitcher() {
  const { userProfile, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role: UserType) => {
    await switchRole(role);
    navigate(role === 'supplier' ? '/supplier/dashboard' : '/customer/dashboard');
  };

  if (!userProfile?.roles.length) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
        {userProfile.activeRole === 'supplier' ? (
          <Building2 className="h-5 w-5" />
        ) : (
          <Users className="h-5 w-5" />
        )}
        <span>
          {userProfile.activeRole === 'supplier' ? 'Modo Fornecedor' : 'Modo Cliente'}
        </span>
      </button>

      <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
        {userProfile.roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSwitch(role)}
            className={`
              w-full text-left px-4 py-2 text-sm
              ${userProfile.activeRole === role ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <div className="flex items-center gap-2">
              {role === 'supplier' ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              {role === 'supplier' ? 'Modo Fornecedor' : 'Modo Cliente'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}