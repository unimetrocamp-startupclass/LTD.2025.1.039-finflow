import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileDown, File as FilePdf, FileSpreadsheet, DollarSign, PiggyBank, CreditCard, Download, BarChart3 } from 'lucide-react';
import { TransactionManager } from '../models/TransactionManager';
import { Transaction } from '../models/Transaction';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const [manager] = useState(() => new TransactionManager());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await manager.loadTransactions();
    setTransactions(manager.getTransactions());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
  const totalExpense = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
  const total = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all shadow-sm"
          >
            <ArrowLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              Relatórios Financeiros
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Visualize e exporte seus dados financeiros
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform hover:scale-102 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Total de Receitas
              </h3>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Total acumulado de entradas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform hover:scale-102 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Total de Despesas
              </h3>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Total acumulado de saídas
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform hover:scale-102 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Saldo Total
              </h3>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className={`text-3xl font-bold ${total >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(total)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Balanço geral atual
            </p>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Download className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Exportar Relatórios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* PDF Export */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <FilePdf className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Relatório em PDF
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Formato ideal para impressão
                  </p>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Relatório completo com todas as transações, gráficos e análises em formato profissional para impressão.
              </p>
              <button
                onClick={() => manager.exportToPDF()}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FileDown size={20} />
                Baixar PDF
              </button>
            </div>

            {/* Excel Export */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Planilha Excel
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Ideal para análises detalhadas
                  </p>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Exportação completa em formato Excel, perfeita para análises personalizadas e integração com outras ferramentas.
              </p>
              <button
                onClick={() => manager.exportToExcel()}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FileDown size={20} />
                Baixar Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}