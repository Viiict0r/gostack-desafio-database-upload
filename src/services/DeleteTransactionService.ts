import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  private repository: TransactionsRepository;

  constructor() {
    this.repository = new TransactionsRepository();
  }

  public async execute(id: string): Promise<void> {
    const checkExists = await this.repository.findById(id);

    if (!checkExists) {
      throw new AppError('Transaction not found', 404);
    }

    await this.repository.deleteTransaction(id);
  }
}

export default DeleteTransactionService;
