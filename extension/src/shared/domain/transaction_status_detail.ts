import { TransactionCurrency, TransactionStatus } from "./transaction";

type ProcessorResponse = {
  processor: string;
  reference: string;
  status: "success" | "rejected";
  date: string;
  message?: string;
};

type TransactionStatusDetail = {
  id: string;
  status: TransactionStatus;
  receiving_account_id?: string;
  amount?: {
    total_paid: string;
    paid_currency: TransactionCurrency;
    added_percentage?: string;
    added_amount?: string;
    original_amount?: string;
  };
  responses?: ProcessorResponse[];
};
export default TransactionStatusDetail;
