/* eslint-disable no-console */
import path from 'path';

import Transaction from '../models/Transaction';
import loadCSV from '../utils/CsvReader';
import CreateTransactionService from './CreateTransactionService';

interface IRequest {
  file: string;
}
class ImportTransactionsService {
  async execute({ file }: IRequest): Promise<Transaction[] | undefined> {
    const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
    const directory = `${tmpFolder}/${file}`;

    const lines = await loadCSV(directory);

    const service = new CreateTransactionService();
    const promises: Promise<Transaction>[] = [];

    lines.forEach(line => {
      const title = line[0];
      const type = line[1];
      const value = Number(line[2]);
      const category = line[3];

      try {
        const transactionPromise = service.execute(
          {
            title,
            type,
            value,
            category,
          },
          false,
        );

        promises.push(transactionPromise);
      } catch (error) {
        console.log(error);
      }
    });

    let transactions: Transaction[] = [];

    await Promise.all(promises).then(transaction => {
      transactions = transaction;
    });

    return transactions;
  }
}

export default ImportTransactionsService;
