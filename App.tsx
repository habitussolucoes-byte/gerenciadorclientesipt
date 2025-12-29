
import React, { useState, useEffect, useCallback } from 'react';
import { Client, DashboardStats } from './types';
import { getStatus, formatCurrency } from './utils/dateUtils';
import Dashboard from './components/Dashboard';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

const LOCAL_STORAGE_KEY = 'gerenciador_tv_clients';

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (updatedClients: Client[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  const handleAddClient = (client: Client) => {
    const updated = [...clients, client];
    saveToStorage(updated);
    setIsAdding(false);
  };

  const handleUpdateClient = (client: Client) => {
    const updated = clients.map(c => c.id === client.id ? client : c);
    saveToStorage(updated);
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const updated = clients.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const stats: DashboardStats = {
    activeCount: clients.filter(c => getStatus(c.expirationDate) !== 'EXPIRED').length,
    expiringCount: clients.filter(c => getStatus(c.expirationDate) === 'EXPIRING_SOON').length,
    revenueForecast: clients
      .filter(c => getStatus(c.expirationDate) !== 'EXPIRED')
      .reduce((acc, c) => acc + (c.value / c.durationMonths), 0) * 1 // Rough estimate for 30 days
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24">
      <header className="bg-blue-600 text-white p-6 shadow-md rounded-b-3xl">
        <h1 className="text-2xl font-bold">TV Online Manager</h1>
        <p className="text-sm opacity-80">Gerenciador de clientes e finanças</p>
      </header>

      <main className="px-4 mt-6">
        <Dashboard stats={stats} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Seus Clientes</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
            >
              + Novo
            </button>
          </div>

          <ClientList 
            clients={clients} 
            onEdit={setEditingClient} 
            onDelete={handleDeleteClient} 
          />
        </div>
      </main>

      {(isAdding || editingClient) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <ClientForm 
              initialData={editingClient || undefined}
              onSubmit={editingClient ? handleUpdateClient : handleAddClient} 
              onCancel={() => {
                setIsAdding(false);
                setEditingClient(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Floating notification for expiring clients */}
      {stats.expiringCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded shadow-lg z-40">
          <p className="font-bold">Aviso de Vencimento!</p>
          <p className="text-sm">Você tem {stats.expiringCount} {stats.expiringCount === 1 ? 'cliente' : 'clientes'} com assinatura vencendo em 3 dias ou menos.</p>
        </div>
      )}
    </div>
  );
};

export default App;
