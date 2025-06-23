import PaymentGateway from "../../data/payment_gateway";
import TransactionsRepository from "../../data/transactions_repository";
import Transaction, { TransactionCreateData } from "../../domain/transaction";
import { logger } from "../../utils/logger";

export default class TransactionService {
  constructor(
    public readonly transactionsRepository: TransactionsRepository,
    public readonly paymentsGateway: PaymentGateway
  ) {}

  public async createTransaction(
    data: TransactionCreateData
  ): Promise<Transaction> {
    logger.info(`Creating transaction with data: ${JSON.stringify(data)}`);
    try {
      const paymentTransaction = await this.paymentsGateway.createTransaction(
        data
      );
      const transactionId = await this.transactionsRepository.createTransaction(
        paymentTransaction
      );
      logger.info(`Transaction created successfully: ${transactionId}`);
      return await this.transactionsRepository.getTransaction(transactionId);
    } catch (error) {
      logger.error(`Error creating transaction: ${error}`);
      throw error;
    }
  }

  public async updateLocalTransactionForGatewayTransactionId(id: string) {
    logger.info(
      `Updating local transaction with gateway transaction with id ${id}`
    );
    try {
      const gatewayTransaction =
        await this.paymentsGateway.getTransactionStatus(id);
      await this.transactionsRepository.updateTransaction(id, {
        status: gatewayTransaction.status,
      });
      logger.info(
        `Successfully updated local transaction for gateway transaction ID ${id}`
      );
    } catch (error) {
      logger.error(
        error,
        `Error updating local transaction for gateway transaction ID ${id}:`
      );
    }
  }
}
