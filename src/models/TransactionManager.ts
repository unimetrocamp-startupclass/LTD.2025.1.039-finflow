import { Transaction } from './Transaction';

export class TransactionManager {
  private transactions: Transaction[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      const data = JSON.parse(saved);
      this.transactions = data.map((t: any) => new Transaction(
        t.description,
        t.amount,
        t.type,
        t.category,
        new Date(t.date)
      ));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
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

  searchTransactions(query: string): Transaction[] {
    const lowercaseQuery = query.toLowerCase();
    return this.transactions.filter(t =>
      t.description.toLowerCase().includes(lowercaseQuery) ||
      t.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterByCategory(category: string): Transaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  getCategories(): string[] {
    return Array.from(new Set(this.transactions.map(t => t.category)));
  }
}