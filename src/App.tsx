import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Search, Calendar, Moon, Sun, PieChart } from 'lucide-react';
import { Transaction } from './models/Transaction';
import { TransactionManager } from './models/TransactionManager';
import { Toaster, toast } from 'react-hot-toast';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CATEGORIES = [
  'Salário',
  'Investimentos',
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros'
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA8DA', '#80DEEA', '#FFE082'];

function App() {
  const [manager] = useState(() => new TransactionManager());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    setTransactions(manager.getTransactions());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast.error('Preencha todos os campos!');
      return;
    }

    const transaction = new Transaction(
      description,
      Number(amount),
      type,
      category
    );

    manager.addTransaction(transaction);
    setTransactions(manager.getTransactions());
    setDescription('');
    setAmount('');
    toast.success('Transação adicionada com sucesso!');
  };

  const handleDelete = (index: number) => {
    manager.removeTransaction(index);
    setTransactions(manager.getTransactions());
    toast.success('Transação removida com sucesso!');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setTransactions(manager.searchTransactions(query));
    } else {
      setTransactions(manager.getTransactions());
    }
  };

  const total = manager.getTotal();
  const monthlyTotal = manager.getMonthlyTotal(selectedMonth, selectedYear);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getCategoryData = () => {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Toaster position="top-right" />
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Gerenciador Financeiro
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="text-white" size={24} />
            ) : (
              <Moon className="text-gray-800" size={24} />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ex: Salário, Conta de luz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle size={20} />
              Adicionar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Saldo Total</h2>
            <p className={`text-2xl font-bold ${total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              R$ {total.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Saldo do Mês</h2>
            <div className="flex items-center gap-2 mb-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="p-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            <p className={`text-2xl font-bold ${monthlyTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              R$ {monthlyTotal.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Distribuição de Gastos</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={getCategoryData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Transações</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {transactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma transação encontrada
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {transaction.category}
                        </span>
                        <Calendar size={14} className="inline" />
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                      <p className={`text-sm ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;