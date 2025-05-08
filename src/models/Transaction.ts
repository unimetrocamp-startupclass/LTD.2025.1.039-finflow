export class Transaction {
  constructor(
    private _description: string,
    private _amount: number,
    private _type: 'income' | 'expense',
    private _category: string,
    private _date: Date = new Date()
  ) {}

  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get type(): 'income' | 'expense' {
    return this._type;
  }

  get category(): string {
    return this._category;
  }

  get date(): Date {
    return this._date;
  }

  toJSON() {
    return {
      description: this._description,
      amount: this._amount,
      type: this._type,
      category: this._category,
      date: this._date.toISOString()
    };
  }
}