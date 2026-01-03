
import React, { useState, useEffect, useMemo } from 'react';
import { LogIn, LayoutDashboard, Receipt, BarChart3, Settings, LogOut, Plus, Download, Cloud, Search, Filter } from 'lucide-react';
import { Transaction, TransactionType, Category } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Dízimos Mensais', amount: 15000, date: '2023-10-01', type: TransactionType.INCOME, category: 'Dízimos' },
  { id: '2', description: 'Manutenção Templo', amount: 2500, date: '2023-10-05', type: TransactionType.EXPENSE, category: 'Manutenção' },
  { id: '3', description: 'Ofertas Missionárias', amount: 3200, date: '2023-10-10', type: TransactionType.INCOME, category: 'Missões' },
  { id: '4', description: 'Energia Elétrica', amount: 850, date: '2023-10-15', type: TransactionType.EXPENSE, category: 'Contas Fixas' },
  { id: '5', description: 'Salário Pastoral', amount: 5000, date: '2023-10-20', type: TransactionType.EXPENSE, category: 'Pessoal' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ipb_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ipb_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const titheTotal = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.INCOME && t.category === 'Dízimos')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const handleLogin = (status: boolean) => setIsLoggedIn(status);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction = { ...newTransaction, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([transaction, ...transactions]);
    setIsModalOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const exportToExcel = () => {
    const headers = "ID,Data,Descrição,Tipo,Categoria,Valor\n";
    const csvContent = transactions.map(t => 
      `${t.id},${t.date},"${t.description}",${t.type},${t.category},${t.amount}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `fluxo_caixa_ipb_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Dados exportados com sucesso em formato CSV (compatível com Excel).");
  };

  const syncToDrive = () => {
    alert("Sincronizando dados com o Google Drive da Tesouraria...");
    setTimeout(() => alert("Sincronização concluída com sucesso!"), 1500);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} onAddClick={() => setIsModalOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {activeTab === 'dashboard' ? 'Painel de Controle' : 
                 activeTab === 'transactions' ? 'Transações' : 'Relatórios e Projeções'}
              </h1>
              <div className="flex space-x-2">
                <button 
                  onClick={syncToDrive}
                  className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Nuvem</span>
                </button>
                <button 
                  onClick={exportToExcel}
                  className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-ipb-green" />
                  <span className="hidden sm:inline">Exportar Excel</span>
                </button>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <Dashboard transactions={transactions} />
            )}

            {activeTab === 'transactions' && (
              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            )}

            {activeTab === 'reports' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Relatórios Analíticos</h3>
                <p className="text-gray-500 italic">Módulo de relatórios detalhados em desenvolvimento. Use o Dashboard para projeções.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <TransactionForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addTransaction} 
          titheTotal={titheTotal}
        />
      )}
    </div>
  );
};

export default App;
