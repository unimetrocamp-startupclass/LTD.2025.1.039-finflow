import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Calendar, Moon, Sun, PieChart, Plus, X, FileDown, Wallet, TrendingUp, TrendingDown, LayoutDashboard, Search as SearchIcon, FileText, BarChart3, ChevronRight } from 'lucide-react';
import { Transaction } from './models/Transaction';
import { TransactionManager } from './models/TransactionManager';
import { Toaster, toast } from 'react-hot-toast';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Search from './pages/Search';
import Reports from './pages/Reports';

function Dashboard() {
  const [manager] = useState(() => new TransactionManager());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await manager.loadTransactions();
    setTransactions(manager.getTransactions());
  };

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await manager.addTransaction(transaction);
      await loadTransactions();
      setDescription('');
      setAmount('');
      setIsAddingTransaction(false);
      toast.success('Transação adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error('Erro ao adicionar transação. Tente novamente.');
    }
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

  const handleDelete = async (index: number) => {
    try {
      await manager.removeTransaction(index);
      await loadTransactions();
      toast.success('Transação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover transação:', error);
      toast.error('Erro ao remover transação. Tente novamente.');
    }
  };

  const total = manager.getTotal();
  const monthlyTotal = manager.getMonthlyTotal(selectedMonth, selectedYear);
  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
  const totalExpense = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-right" />
      
      {/* Collapsible Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className={`p-4 ${isSidebarExpanded ? 'px-6' : 'px-2'}`}>
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary-600" />
            <h1 className={`text-2xl font-bold text-primary-600 dark:text-primary-400 transition-opacity duration-300 ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              FinFlow
            </h1>
          </div>
        </div>
        
        <nav className="mt-6">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-r-4 border-transparent hover:border-primary-600 transition-all ${
              isSidebarExpanded ? 'px-6' : 'px-2 justify-center'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className={`ml-3 transition-opacity duration-300 ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Dashboard
            </span>
          </Link>
          
          <Link
            to="/search"
            className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-r-4 border-transparent hover:border-primary-600 transition-all ${
              isSidebarExpanded ? 'px-6' : 'px-2 justify-center'
            }`}
          >
            <SearchIcon className="h-5 w-5" />
            <span className={`ml-3 transition-opacity duration-300 ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Pesquisa Avançada
            </span>
          </Link>
          
          <Link
            to="/reports"
            className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-r-4 border-transparent hover:border-primary-600 transition-all ${
              isSidebarExpanded ? 'px-6' : 'px-2 justify-center'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className={`ml-3 transition-opacity duration-300 ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Relatórios
            </span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddingTransaction(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Transação
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="text-white" size={24} />
                ) : (
                  <Moon className="text-gray-800" size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Saldo Total</h3>
                <Wallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className={`text-3xl font-bold ${total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(total)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Receitas</h3>
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Despesas</h3>
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>

          {/* Charts and Transactions */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Chart */}
            <div className="col-span-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                  Distribuição de Gastos
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={getCategoryData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
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

            {/* Right Column - Transactions */}
            <div className="col-span-7">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Últimas Transações
                  </h3>
                  <Link
                    to="/search"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-2"
                  >
                    <SearchIcon size={18} />
                    Pesquisa Avançada
                  </Link>
                </div>

                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Nenhuma transação encontrada
                    </p>
                  ) : (
                    transactions.map((transaction, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="px-2 py-1 rounded-full text-xs" style={{
                                backgroundColor: manager.getCategories().find(c => c.name === transaction.category)?.color + '33',
                                color: manager.getCategories().find(c => c.name === transaction.category)?.color
                              }}>
                                {transaction.category}
                              </span>
                              <span>•</span>
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`font-medium ${
                            transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </p>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Nova Transação */}
      {isAddingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Nova Transação
              </h3>
              <button
                onClick={() => setIsAddingTransaction(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                  placeholder="0,00"
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
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
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
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Nova
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                  >
                    <option value="">Selecione uma categoria</option>
                    {manager.getCategoriesByType(type).map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingTransaction(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nova Categoria */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Nova Categoria
              </h3>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
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
                  className="w-full h-10 p-1 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;