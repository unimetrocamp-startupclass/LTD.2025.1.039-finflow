import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Search, Calendar, Moon, Sun, PieChart, Plus, X, FileDown, Lock } from 'lucide-react';
import { Transaction } from './models/Transaction';
import { TransactionManager } from './models/TransactionManager';
import { Toaster, toast } from 'react-hot-toast';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CryptoViewer } from './components/CryptoViewer';

interface SearchFilters {
  query: string;
  type: 'all' | 'income' | 'expense';
  categories: string[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

function App() {
  const [manager] = useState(() => new TransactionManager());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    categories: [],
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: undefined,
    amountMax: undefined
  });
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');
  const [showCryptoViewer, setShowCryptoViewer] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string>('');

  useEffect(() => {
    setTransactions(manager.getTransactions());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Novo useEffect para atualizar os dados criptografados
  useEffect(() => {
    const rawData = localStorage.getItem('transactions') || '';
    setEncryptedData(rawData);
  }, [transactions]); // Atualiza quando as transações mudam

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName) {
      toast.error('Digite um nome para a categoria');
      return;
    }

    manager.addCategory(newCategoryName, newCategoryType, newCategoryColor);
    setNewCategoryName('');
    setIsAddingCategory(false);
    toast.success('Categoria adicionada com sucesso!');
  };

  const handleDelete = (index: number) => {
    manager.removeTransaction(index);
    setTransactions(manager.getTransactions());
    toast.success('Transação removida com sucesso!');
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setTransactions(manager.searchTransactions({ ...filters, query }));
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setTransactions(manager.searchTransactions(updatedFilters));
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowCryptoViewer(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Visualizar Criptografia"
            >
              <Lock className={isDarkMode ? "text-white" : "text-gray-800"} size={24} />
            </button>
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
                  onChange={(e) => {
                    setType(e.target.value as 'income' | 'expense');
                    setCategory('');
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Nova
                  </button>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Selecione uma categoria</option>
                  {manager.getCategoriesByType(type).map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
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

        {isAddingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Nova Categoria</h3>
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Academia, Streaming"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newCategoryType}
                    onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor
                  </label>
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-md cursor-pointer"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                    {getCategoryData().map((entry, index) => {
                      const category = manager.getCategories().find(c => c.name === entry.name);
                      return (
                        <Cell key={`cell-${index}`} fill={category?.color || '#607D8B'} />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquisar por descrição ou categoria..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Filtros Avançados
            </button>
          </div>

          {isFiltersPanelOpen && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleFilterChange({ dateFrom: e.target.value ? new Date(e.target.value) : undefined })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleFilterChange({ dateTo: e.target.value ? new Date(e.target.value) : undefined })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Mínimo
                  </label>
                  <input
                    type="number"
                    value={filters.amountMin || ''}
                    onChange={(e) => handleFilterChange({ amountMin: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="R$ 0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Máximo
                  </label>
                  <input
                    type="number"
                    value={filters.amountMax || ''}
                    onChange={(e) => handleFilterChange({ amountMax: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="R$ 0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange({ type: e.target.value as 'income' | 'expense' | 'all' })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value="all">Todos</option>
                  <option value="income">Receitas</option>
                  <option value="expense">Despesas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categorias
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {manager.getCategories().map(cat => (
                    <label key={cat.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(cat.name) || false}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...(filters.categories || []), cat.name]
                            : (filters.categories || []).filter(c => c !== cat.name);
                          handleFilterChange({ categories: newCategories });
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setFilters({
                      query: '',
                      type: 'all',
                      categories: [],
                      dateFrom: undefined,
                      dateTo: undefined,
                      amountMin: undefined,
                      amountMax: undefined
                    });
                    setTransactions(manager.getTransactions());
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Transações</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => manager.exportToPDF()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FileDown size={18} />
                  PDF
                </button>
                <button
                  onClick={() => manager.exportToExcel()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FileDown size={18} />
                  Excel
                </button>
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
                        <span 
                          className="px-2 py-1 rounded" 
                          style={{
                            backgroundColor: manager.getCategories().find(c => c.name === transaction.category)?.color + '33',
                            color: manager.getCategories().find(c => c.name === transaction.category)?.color
                          }}
                        >
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

        {showCryptoViewer && (
          <CryptoViewer
            onClose={() => setShowCryptoViewer(false)}
            rawData={encryptedData}
          />
        )}
      </div>
    </div>
  );
}

export default App;