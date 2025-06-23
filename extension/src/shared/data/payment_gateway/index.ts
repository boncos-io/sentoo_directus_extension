import Transaction, {
  TransactionCreateData,
  TransactionPrimaryKey,
} from "../../domain/transaction";
import TransactionStatusDetail from "../../domain/transaction_status_detail";

export default interface PaymentGateway {
  createTransaction(data: TransactionCreateData): Promise<Transaction>;
  getTransactionStatus(
    id: TransactionPrimaryKey
  ): Promise<TransactionStatusDetail>;
  cancelTransaction(id: TransactionPrimaryKey): Promise<void>;
}
