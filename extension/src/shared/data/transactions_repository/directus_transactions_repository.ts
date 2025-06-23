import { ApiExtensionContext } from "@directus/extensions";
import { logger } from "../../utils/logger";
import TransactionsRepository from ".";
import Transaction, {
  TransactionCreateData,
  TransactionPrimaryKey,
  TransactionUpdateData,
} from "../../domain/transaction";

export const TRANSACTIONS_TABLE_NAME = "sentoo_transactions";

export default class DirectusTransactionsRepository
  implements TransactionsRepository
{
  constructor(private readonly extensionContext: ApiExtensionContext) {}
  public async createTransaction(
    data: TransactionCreateData
  ): Promise<TransactionPrimaryKey> {
    try {
      const service = await this.createItemsService();
      return await service.createOne(data);
    } catch (e) {
      logger.error(e, "Error creating transaction");
      throw e;
    }
  }

  public async getTransaction(id: TransactionPrimaryKey): Promise<Transaction> {
    try {
      const service = await this.createItemsService();
      const transaction = await service.readOne(id, {
        fields: ["*"],
      });
      return transaction as Transaction;
    } catch (e) {
      logger.error(e, "Error getting transaction");
      throw e;
    }
  }
  public async updateTransaction(
    id: TransactionPrimaryKey,
    data: TransactionUpdateData
  ): Promise<void> {
    try {
      const service = await this.createItemsService();
      await service.updateOne(id, data);
    } catch (e) {
      logger.error(e, "Error updating transaction status");
      throw e;
    }
  }

  private async createItemsService(): Promise<any> {
    const schema = await this.extensionContext.getSchema();
    return new this.extensionContext.services.ItemsService(
      TRANSACTIONS_TABLE_NAME,
      {
        knex: this.extensionContext.database,
        schema: schema,
      }
    );
  }
}
