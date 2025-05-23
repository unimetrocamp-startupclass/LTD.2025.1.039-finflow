import { supabase } from '../lib/supabase';

export class Transaction {
  constructor(
    private _description: string,
    private _amount: number,
    private _type: 'income' | 'expense',
    private _category: string,
    private _date: Date = new Date(),
    private _id?: string
  ) {}

  get id(): string | undefined {
    return this._id;
  }

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

  static async fromSupabase(data: any): Promise<Transaction> {
    return new Transaction(
      data.description,
      data.amount,
      data.type,
      data.category,
      new Date(data.date),
      data.id
    );
  }

  async save(): Promise<void> {
    const { error } = await supabase.from('transactions').insert({
      description: this._description,
      amount: this._amount,
      type: this._type,
      category: this._category,
      date: this._date.toISOString(),
    });

    if (error) throw error;
  }

  async delete(): Promise<void> {
    if (!this._id) throw new Error('Transação não possui ID');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', this._id);

    if (error) throw error;
  }

  toJSON() {
    return {
      id: this._id,
      description: this._description,
      amount: this._amount,
      type: this._type,
      category: this._category,
      date: this._date.toISOString()
    };
  }
}