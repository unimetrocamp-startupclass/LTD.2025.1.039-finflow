export class Transaction {
  constructor(
    private _description: string,
    private _amount: number,
    private _type: 'income' | 'expense'
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

  toJSON() {
    return {
      description: this._description,
      amount: this._amount,
      type: this._type
    };
  }
}