import Transaction, {
  TransactionCreateData,
  TransactionPrimaryKey,
  TransactionUpdateData,
} from "../../domain/transaction";

export default abstract class TransactionsRepository {
  abstract createTransaction(
    data: TransactionCreateData
  ): Promise<TransactionPrimaryKey>;
  abstract getTransaction(id: TransactionPrimaryKey): Promise<Transaction>;
  abstract updateTransaction(
    id: TransactionPrimaryKey,
    data: TransactionUpdateData
  ): Promise<void>;
}
