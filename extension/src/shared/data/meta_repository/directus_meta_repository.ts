import { ApiExtensionContext } from "@directus/extensions";
import MetaRepository from ".";
import { logger } from "../../utils/logger";

export const META_TABLE_NAME = "sentoo_meta_info";

export default class DirectusMetaRepository implements MetaRepository {
  constructor(private readonly extensionContext: ApiExtensionContext) {}

  async getAppliedVersion(): Promise<number | null> {
    try {
      const itemsService = await this.createItemsService();
      const meta = await itemsService.readSingleton({});
      return meta?.version || null;
    } catch (e) {
      if (
        e instanceof TypeError &&
        e.message.includes("Cannot read properties of undefined")
      ) {
        // This means the table does not exist yet, which is expected on first run
        return null;
      } else {
        logger.error(e, "Unkown error reading meta info");
        throw e;
      }
    }
  }

  async setAppliedVersion(version: number): Promise<void> {
    try {
      const itemsService = await this.createItemsService();
      await itemsService.upsertSingleton({ version });
    } catch (e) {
      logger.error(e, "Unkown error setting meta info version");
      throw e;
    }
  }

  private async createItemsService(): Promise<any> {
    const schema = await this.extensionContext.getSchema();
    return new this.extensionContext.services.ItemsService(META_TABLE_NAME, {
      knex: this.extensionContext.database,
      schema: schema,
    });
  }
}
