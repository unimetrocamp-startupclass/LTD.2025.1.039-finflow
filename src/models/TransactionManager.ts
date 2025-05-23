import { Transaction } from './Transaction';
import { supabase } from '../lib/supabase';
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
    this.loadCategories();
    this.loadTransactions();
  }

  private loadCategories(): void {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
    } else {
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

  private saveCategories(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  async loadTransactions(): Promise<void> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao carregar transações:', error);
      return;
    }

    this.transactions = await Promise.all(
      data.map(t => Transaction.fromSupabase(t))
    );
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

  async addTransaction(transaction: Transaction): Promise<void> {
    await transaction.save();
    await this.loadTransactions();
  }

  async removeTransaction(index: number): Promise<void> {
    const transaction = this.transactions[index];
    if (transaction) {
      await transaction.delete();
      await this.loadTransactions();
    }
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

    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 14, 20);

    doc.setFontSize(14);
    doc.text(`Saldo Total: R$ ${total.toFixed(2)}`, 14, 30);

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

    const colWidths = [
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 10 },
      { wch: 12 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'relatorio-financeiro.xlsx');
  }
}