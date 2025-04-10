import { Transaction } from './Transaction';

export class TransactionManager {
  private transactions: Transaction[] = [];

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  removeTransaction(index: number): void {
    this.transactions.splice(index, 1);
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
}