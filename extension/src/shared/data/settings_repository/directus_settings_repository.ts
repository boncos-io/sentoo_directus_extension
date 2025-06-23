import { ApiExtensionContext } from "@directus/extensions";
import SettingsRepository from ".";
import Settings from "../../domain/settings";
import { logger } from "../../utils/logger";

export default class DirectusSettingsRepository implements SettingsRepository {
  constructor(private readonly extensionContext: ApiExtensionContext) {}

  public async getSettings(): Promise<Settings> {
    try {
      const service = await this.createSettingsService();
      const {
        sentoo_api_host,
        sentoo_merchant_id,
        sentoo_merchant_secret,
        sentoo_default_currency,
        sentoo_default_return_url,
      } = await service.readSingleton({
        fields: [
          "sentoo_api_host",
          "sentoo_merchant_id",
          "sentoo_merchant_secret",
          "sentoo_default_currency",
          "sentoo_default_return_url",
        ],
      });
      return {
        apiHost: sentoo_api_host,
        merchantId: sentoo_merchant_id,
        merchantSecret: sentoo_merchant_secret,
        defaultCurrency: sentoo_default_currency,
        defaultReturnUrl: sentoo_default_return_url,
      };
    } catch (e) {
      logger.error(e, "Error getting settings");
      throw e;
    }
  }

  private async createSettingsService(): Promise<any> {
    const schema = await this.extensionContext.getSchema();
    return new this.extensionContext.services.SettingsService({
      knex: this.extensionContext.database,
      schema: schema,
    });
  }
}
