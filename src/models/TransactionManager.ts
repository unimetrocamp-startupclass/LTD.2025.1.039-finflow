import { Transaction } from './Transaction';
import { CryptoManager } from './CryptoManager';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface SearchFilters {
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;
  type?: 'income' | 'expense' | 'all';
  categories?: string[];
  amountMin?: number;
  amountMax?: number;
}

export class TransactionManager {
  private transactions: Transaction[] = [];
  private categories: { name: string; type: 'income' | 'expense'; color: string }[] = [];

  constructor() {
    this.loadFromLocalStorage();
    this.loadCategories();
  }

  private async loadFromLocalStorage(): Promise<void> {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        const decrypted = await CryptoManager.decrypt(saved);
        const data = JSON.parse(decrypted);
        this.transactions = data.map((t: any) => new Transaction(
          t.description,
          t.amount,
          t.type,
          t.category,
          new Date(t.date)
        ));
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
        this.transactions = [];
      }
    }
  }

  private loadCategories(): void {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
    } else {
      // Default categories
      this.categories = [
        { name: 'Salário', type: 'income', color: '#4CAF50' },
        { name: 'Investimentos', type: 'income', color: '#2196F3' },
        { name: 'Alimentação', type: 'expense', color: '#FF5722' },
        { name: 'Transporte', type: 'expense', color: '#795548' },
        { name: 'Moradia', type: 'expense', color: '#9C27B0' },
        { name: 'Lazer', type: 'expense', color: '#FF9800' },
        { name: 'Saúde', type: 'expense', color: '#E91E63' },
        { name: 'Educação', type: 'expense', color: '#3F51B5' },
        { name: 'Outros', type: 'expense', color: '#607D8B' }
      ];
      this.saveCategories();
    }
  }

  private async saveToLocalStorage(): Promise<void> {
    try {
      const encrypted = await CryptoManager.encrypt(JSON.stringify(this.transactions));
      localStorage.setItem('transactions', encrypted);
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      throw new Error('Falha ao salvar as transações');
    }
  }

  private saveCategories(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  addCategory(name: string, type: 'income' | 'expense', color: string): void {
    if (!this.categories.some(c => c.name === name)) {
      this.categories.push({ name, type, color });
      this.saveCategories();
    }
  }

  removeCategory(name: string): void {
    this.categories = this.categories.filter(c => c.name !== name);
    this.saveCategories();
  }

  getCategories(): { name: string; type: 'income' | 'expense'; color: string }[] {
    return [...this.categories];
  }

  getCategoriesByType(type: 'income' | 'expense'): { name: string; type: 'income' | 'expense'; color: string }[] {
    return this.categories.filter(c => c.type === type);
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveToLocalStorage();
  }

  removeTransaction(index: number): void {
    this.transactions.splice(index, 1);
    this.saveToLocalStorage();
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  searchTransactions(filters: SearchFilters): Transaction[] {
    return this.transactions.filter(transaction => {
      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        const searchableText = `${transaction.description} ${transaction.category}`.toLowerCase();
        if (!searchableText.includes(searchQuery)) {
          return false;
        }
      }

      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        if (transaction.date > dateTo) {
          return false;
        }
      }

      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
        return false;
      }

      if (filters.amountMin !== undefined && transaction.amount < filters.amountMin) {
        return false;
      }
      if (filters.amountMax !== undefined && transaction.amount > filters.amountMax) {
        return false;
      }

      return true;
    });
  }

  getTotal(): number {
    return this.transactions.reduce((total, transaction) => {
      return transaction.type === 'income'
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  }

  getMonthlyTotal(month: number, year: number): number {
    return this.transactions
      .filter(t => {
        const date = t.date;
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((total, transaction) => {
        return transaction.type === 'income'
          ? total + transaction.amount
          : total - transaction.amount;
      }, 0);
  }

  filterByCategory(category: string): Transaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const total = this.getTotal();

    // Título
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 14, 20);

    // Saldo total
    doc.setFontSize(14);
    doc.text(`Saldo Total: R$ ${total.toFixed(2)}`, 14, 30);

    // Tabela de transações
    const tableData = this.transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.category,
      t.type === 'income' ? 'Receita' : 'Despesa',
      `R$ ${t.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Download do PDF
    doc.save('relatorio-financeiro.pdf');
  }

  exportToExcel(): void {
    const data = this.transactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Descrição: t.description,
      Categoria: t.category,
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Valor: t.amount.toFixed(2)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 12 }, // Data
      { wch: 30 }, // Descrição
      { wch: 15 }, // Categoria
      { wch: 10 }, // Tipo
      { wch: 12 }  // Valor
    ];
    ws['!cols'] = colWidths;

    // Download do Excel
    XLSX.writeFile(wb, 'relatorio-financeiro.xlsx');
  }
}