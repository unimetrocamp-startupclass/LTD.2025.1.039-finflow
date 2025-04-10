import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Transaction } from './models/Transaction';
import { TransactionManager } from './models/TransactionManager';

function App() {
  const [manager] = useState(() => new TransactionManager());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) return;

    const transaction = new Transaction(
      description,
      Number(amount),
      type
    );

    manager.addTransaction(transaction);
    setTransactions(manager.getTransactions());
    setDescription('');
    setAmount('');
  };

  const handleDelete = (index: number) => {
    manager.removeTransaction(index);
    setTransactions(manager.getTransactions());
  };

  const total = manager.getTotal();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Gerenciador Financeiro
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Salário, Conta de luz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              Adicionar
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Saldo Total</h2>
          <p className={`text-2xl font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {total.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transações</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma transação cadastrada
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className={`text-sm ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
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