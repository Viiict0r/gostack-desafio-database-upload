import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ITransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private repository: Repository<Transaction>;

  constructor() {
    super();

    this.repository = getRepository(Transaction);
  }

  public async all(): Promise<Transaction[]> {
    const transactions = await this.repository.find({
      relations: ['category'],
    });

    return transactions;
  }

  public async deleteTransaction(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const transaction = await this.repository.findOne(id);

    return transaction;
  }

  public async createTransaction({
    title,
    value,
    category_id,
    type,
  }: ITransactionDTO): Promise<Transaction> {
    const transaction = this.repository.create({
      title,
      value,
      category_id,
      type,
    });

    await this.repository.save(transaction);

    return transaction;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.repository.find();

    const income = transactions.reduce((a, b) => {
      if (b.type === 'income') return a + b.value;
      return a;
    }, 0);

    const outcome = transactions.reduce((a, b) => {
      if (b.type === 'outcome') return a + b.value;
      return a;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
