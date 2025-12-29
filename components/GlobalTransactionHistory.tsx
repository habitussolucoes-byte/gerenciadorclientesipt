
import React from 'react';
import { Client } from '../types';
import { formatDateBR, formatCurrency } from '../utils/dateUtils';

interface Props {
  clients: Client[];
}

const GlobalTransactionHistory: React.FC<Props> = ({ clients }) => {
  // Flatten all renewal histories and add the client name to each transaction
  const allTransactions = clients.flatMap(client => 
    (client.renewalHistory || []).map(renewal => ({
      ...renewal,
      clientName: client.name
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (allTransactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 px-6">
        <p className="text-gray-400 font-medium">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allTransactions.map((tx) => (
        <div key={tx.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">
              {formatDateBR(tx.createdAt)}
            </span>
            <h4 className="font-bold text-gray-800 leading-tight">{tx.clientName}</h4>
            <span className="text-[11px] text-gray-400 font-medium">
              Renovação de {tx.durationMonths} {tx.durationMonths === 1 ? 'mês' : 'meses'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-green-600">
              {formatCurrency(tx.value)}
            </p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
              Recebido
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalTransactionHistory;
