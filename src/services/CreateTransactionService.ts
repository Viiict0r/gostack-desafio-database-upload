import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoriesRepository';

import AppError from '../errors/AppError';

interface IRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  private repository: TransactionRepository;

  private categoryRepository: CategoryRepository;

  constructor() {
    this.repository = new TransactionRepository();
    this.categoryRepository = new CategoryRepository();
  }

  public async execute({
    title,
    type,
    value,
    category,
  }: IRequest): Promise<Transaction> {
    const balance = await this.repository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insuficient founds');
    }

    let cat = await this.categoryRepository.findByTitle(category);

    if (!cat) {
      cat = await this.categoryRepository.createCategory(category);
    }

    const transaction = await this.repository.createTransaction({
      title,
      type,
      value,
      category_id: cat.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
