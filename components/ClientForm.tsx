
import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { calculateExpiration } from '../utils/dateUtils';

interface Props {
  onSubmit: (client: Client) => void;
  onCancel: () => void;
  initialData?: Client;
}

const ClientForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    whatsapp: initialData?.whatsapp || '',
    value: initialData?.value?.toString() || '',
    durationMonths: initialData?.durationMonths?.toString() || '1',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0]
  });

  const [expiration, setExpiration] = useState('');

  useEffect(() => {
    if (formData.startDate && formData.durationMonths) {
      const exp = calculateExpiration(formData.startDate, parseInt(formData.durationMonths) || 0);
      setExpiration(exp);
    }
  }, [formData.startDate, formData.durationMonths]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.value) return;

    const client: Client = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name,
      whatsapp: formData.whatsapp,
      value: parseFloat(formData.value),
      durationMonths: parseInt(formData.durationMonths),
      startDate: formData.startDate,
      expirationDate: expiration
    };

    onSubmit(client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome do Cliente</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-semibold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: João Silva"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">WhatsApp (DDD + Número)</label>
        <input
          type="tel"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-semibold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: 11988776655"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-semibold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0,00"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Duração (Meses)</label>
          <select
            value={formData.durationMonths}
            onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-semibold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {[1, 2, 3, 6, 12].map(m => (
              <option key={m} value={m}>{m} {m === 1 ? 'mês' : 'meses'}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data de Início</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-semibold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Vencimento Calculado</p>
        <p className="text-xl font-extrabold text-blue-800">{expiration.split('-').reverse().join('/')}</p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
