
import React from 'react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils/dateUtils';

interface Props {
  stats: DashboardStats;
}

const Dashboard: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Clientes Ativos</p>
        <p className="text-3xl font-bold text-blue-600 mt-1">{stats.activeCount}</p>
      </div>
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm font-medium">Próximo Vencimento</p>
        <p className={`text-3xl font-bold mt-1 ${stats.expiringCount > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
          {stats.expiringCount}
        </p>
      </div>
      <div className="col-span-2 bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100">
        <p className="text-green-700 text-sm font-bold uppercase tracking-wider">Previsão 30 Dias</p>
        <p className="text-4xl font-extrabold text-green-600 mt-1">
          {formatCurrency(stats.revenueForecast)}
        </p>
        <p className="text-xs text-green-600/70 mt-2 font-medium">Considerando renovações pendentes</p>
      </div>
    </div>
  );
};

export default Dashboard;
