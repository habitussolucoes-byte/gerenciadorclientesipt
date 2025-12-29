
import React from 'react';
import { Client } from '../types';
import { formatDateBR, getStatus, formatCurrency } from '../utils/dateUtils';

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientList: React.FC<Props> = ({ clients, onEdit, onDelete }) => {
  const sendWhatsApp = (client: Client) => {
    const text = encodeURIComponent(
      `Olá ${client.name}! Sua assinatura está prestes a vencer.\nPara renovar, o pagamento pode ser feito via Pix.\nCPF: 02530521069`
    );
    const phone = client.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
        <p className="text-gray-400 font-medium">Nenhum cliente cadastrado ainda.</p>
      </div>
    );
  }

  // Sort by expiration date
  const sortedClients = [...clients].sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));

  return (
    <div className="space-y-4">
      {sortedClients.map((client) => {
        const status = getStatus(client.expirationDate);
        const statusColors = {
          ACTIVE: 'bg-green-100 text-green-700',
          EXPIRING_SOON: 'bg-orange-100 text-orange-700 animate-pulse',
          EXPIRED: 'bg-red-100 text-red-700'
        };

        const statusLabel = {
          ACTIVE: 'Ativo',
          EXPIRING_SOON: 'Vence Logo',
          EXPIRED: 'Vencido'
        };

        return (
          <div key={client.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 transition-all active:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
                <p className="text-gray-500 text-sm font-medium">{client.whatsapp}</p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${statusColors[status]}`}>
                {statusLabel[status]}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
              <div className="text-sm">
                <p className="text-gray-400 font-medium">Vencimento</p>
                <p className="font-bold text-gray-700">{formatDateBR(client.expirationDate)}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-400 font-medium">Valor</p>
                <p className="font-bold text-gray-700">{formatCurrency(client.value)}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => sendWhatsApp(client)}
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => onEdit(client)}
                className="bg-gray-100 text-gray-600 p-3 rounded-2xl active:scale-95"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(client.id)}
                className="bg-red-50 text-red-500 p-3 rounded-2xl active:scale-95"
              >
                X
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientList;
