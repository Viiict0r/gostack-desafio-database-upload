import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = new TransactionsRepository();

  const transactions = await transactionRepository.all();
  const balance = await transactionRepository.getBalance();

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const service = new CreateTransactionService();

  const transaction = await service.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const service = new DeleteTransactionService();

  await service.execute(id);

  return response.status(200).json();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
  return response.status(400).json();
});

export default transactionsRouter;
