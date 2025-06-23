export type TransactionStatus =
  | "issued"
  | "pending"
  | "failed"
  | "cancelled"
  | "expired"
  | "success";

export type TransactionPrimaryKey = string;
export type TransactionCurrency = "ANG" | "AWG" | "USD" | "EUR" | "XCD";

type Transaction = {
  id: TransactionPrimaryKey;
  merchant_id: string;
  date_created?: string;
  date_updated?: string;
  status: TransactionStatus;
  amount: number;
  currency: TransactionCurrency;
  description: string;
  return_url: string;
  url: string;
  qr_code: string;
  customer?: string;
  expires?: string;
};
export default Transaction;

export type TransactionCreateData = Required<
  Pick<Transaction, "amount" | "description">
> &
  Partial<
    Omit<
      Transaction,
      | "amount"
      | "description"
      | "merchant_id"
      | "date_created"
      | "date_updated"
      | "status"
    >
  >;

export type TransactionUpdateData = Pick<Transaction, "status">;

export function validateCreatedTransaction(
  transaction: Transaction
): Transaction {
  if (transaction.status && transaction.status !== "issued") {
    throw new Error("Invalid transaction creation status. Must be 'issued'");
  }
  return transaction;
}
