import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { searchCEP } from '../services/cep';

interface AddressFormProps {
  value: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  onChange: (address: any) => void;
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  const [loading, setLoading] = useState(false);

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    onChange({ ...value, cep });

    if (cep.length === 8) {
      setLoading(true);
      const address = await searchCEP(cep);
      setLoading(false);

      if (address) {
        onChange({
          ...value,
          cep,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CEP</label>
          <div className="mt-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={value.cep || ''}
              onChange={handleCEPChange}
              placeholder="00000-000"
              maxLength={8}
              className={`
                pl-10 block w-full rounded-md border-gray-300 shadow-sm 
                focus:ring-primary focus:border-primary sm:text-sm
                ${loading ? 'bg-gray-50' : ''}
              `}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número</label>
          <input
            type="text"
            value={value.number || ''}
            onChange={(e) => onChange({ ...value, number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rua</label>
        <input
          type="text"
          value={value.street || ''}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          readOnly={!value.cep}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Complemento</label>
        <input
          type="text"
          value={value.complement || ''}
          onChange={(e) => onChange({ ...value, complement: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bairro</label>
          <input
            type="text"
            value={value.neighborhood || ''}
            onChange={(e) => onChange({ ...value, neighborhood: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            readOnly={!value.cep}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cidade</label>
          <input
            type="text"
            value={value.city || ''}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            readOnly={!value.cep}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <input
          type="text"
          value={value.state || ''}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          readOnly={!value.cep}
        />
      </div>
    </div>
  );
}