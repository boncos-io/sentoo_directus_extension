import PaymentGateway from ".";
import Settings from "../../domain/settings";
import { logger } from "../../utils/logger";
import SettingsRepository from "../settings_repository";
import Transaction, {
  TransactionCreateData,
  TransactionCurrency,
  TransactionPrimaryKey,
  TransactionStatus,
} from "../../domain/transaction";

import TransactionStatusDetail from "../../domain/transaction_status_detail";

export default class DirectusSentooPaymentGateway implements PaymentGateway {
  constructor(public readonly settingsRepository: SettingsRepository) {}

  async createTransaction(data: TransactionCreateData): Promise<Transaction> {
    try {
      const settings = await this.getValidatedSettings();
      const params = new URLSearchParams({
        sentoo_merchant: settings.merchantId,
        sentoo_amount: data.amount.toFixed(0),
        sentoo_description: data.description,
        sentoo_currency: data.currency ?? settings.defaultCurrency,
        sentoo_return_url: data.return_url ?? settings.defaultReturnUrl,
      });
      if (data.customer) params.append("sentoo_customer", data.customer);
      if (data.expires) params.append("sentoo_expires", data.expires);

      const response = await fetch(`${settings.apiHost}/v1/payment/new`, {
        method: "POST",
        headers: this.authorizedRequestHeaders(settings.merchantSecret),
        body: params,
      });
      if (!response.ok) {
        const error = await response.json();
        throw (
          error ??
          new Error(`Failed to create transaction: ${response.statusText}`)
        );
      }
      const result = (await response.json()) as {
        success: {
          data: Pick<Transaction, "url" | "qr_code">;
          message: TransactionPrimaryKey;
        };
      };
      return {
        id: result.success.message,
        merchant_id: settings.merchantId,
        status: "issued",
        currency: (data.currency ??
          settings.defaultCurrency) as TransactionCurrency,
        return_url: data.return_url ?? settings.defaultReturnUrl,
        ...data,
        ...result.success.data,
      };
    } catch (e) {
      logger.error(e, "Error creating transaction:");
      throw e;
    }
  }

  async getTransactionStatus(
    id: TransactionPrimaryKey
  ): Promise<TransactionStatusDetail> {
    try {
      const settings = await this.getValidatedSettings();
      const response = await fetch(
        `${settings.apiHost}/v1/payment/status/${settings.merchantId}/${id}`,
        {
          method: "GET",
          headers: this.authorizedRequestHeaders(settings.merchantSecret),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw (
          error ??
          new Error(`Failed to get transaction status: ${response.statusText}`)
        );
      }
      const result = (await response.json()) as {
        success: {
          data: TransactionStatusDetail | undefined;
          message: TransactionStatus;
        };
      };
      return {
        id,
        status: result.success.message,
        ...result.success.data,
      };
    } catch (e) {
      logger.error(e, "Error getting transaction status:");
      throw e;
    }
  }

  async cancelTransaction(id: TransactionPrimaryKey): Promise<void> {
    try {
      const settings = await this.getValidatedSettings();
      const response = await fetch(
        `${settings.apiHost}/v1/payment/cancel/${settings.merchantId}/${id}`,
        {
          method: "GET",
          headers: this.authorizedRequestHeaders(settings.merchantSecret),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw (
          error ??
          new Error(`Failed to cancel transaction: ${response.statusText}`)
        );
      }
    } catch (e) {
      logger.error(e, "Error canceling transaction:");
      throw e;
    }
  }

  private authorizedRequestHeaders(
    merchantSecret: string
  ): Record<string, string> {
    return {
      "X-SENTOO-SECRET": merchantSecret,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  private async getValidatedSettings(): Promise<Settings> {
    const settings = await this.settingsRepository.getSettings();
    const missingFields = [];
    if (!settings.apiHost) missingFields.push("apiHost");
    if (!settings.defaultCurrency) missingFields.push("defaultCurrency");
    if (!settings.defaultReturnUrl) missingFields.push("defaultReturnUrl");
    if (!settings.merchantId) missingFields.push("merchantId");
    if (!settings.merchantSecret) missingFields.push("merchantSecret");
    if (missingFields.length > 0) {
      throw new Error(
        `Payment API settings are not properly configured: ${missingFields.join(
          ", "
        )}`
      );
    }
    return settings;
  }
}
