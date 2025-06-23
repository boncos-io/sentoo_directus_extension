import Migration from "../../application/bootstrap_service/migration";
import { ApiExtensionContext } from "@directus/extensions";
import { TRANSACTIONS_TABLE_NAME } from "../transactions_repository/directus_transactions_repository";
import { META_TABLE_NAME } from "../meta_repository/directus_meta_repository";

export default class DirectusMigration00000001InitTransactionsTable
  implements Migration
{
  constructor(private readonly extensionContext: ApiExtensionContext) {}

  get version() {
    return 1;
  }

  get description() {
    return "Initialize sentoo extension tables and settings.";
  }

  async apply(): Promise<void> {
    const collectionsService = await this.createCollectionService();
    await collectionsService.createOne({
      collection: META_TABLE_NAME,
      fields: [
        {
          field: "id",
          type: "integer",
          meta: { hidden: true, interface: "input", readonly: true },
          schema: { is_primary_key: true, has_auto_increment: true },
        },
        {
          field: "version",
          type: "integer",
          meta: { interface: "input", special: null, required: true },
        },
      ],
      schema: {},
      meta: { singleton: true, hidden: true },
    });

    await collectionsService.createOne({
      collection: TRANSACTIONS_TABLE_NAME,
      fields: [
        {
          field: "id",
          type: "uuid",
          schema: {
            is_unique: true,
            is_primary_key: true,
            data_type: "char",
            max_length: 36,
          },
          meta: {
            special: ["uuid"],
            readonly: true,
            hidden: true,
            sort: 1,
            width: "full",
          },
        },
        {
          field: "status",
          type: "string",
          schema: {
            default_value: "issued",
          },
          meta: {
            interface: "select-dropdown",
            options: {
              choices: [
                {
                  text: "Issued",
                  value: "issued",
                  color: "#FFB300",
                },
                {
                  text: "Pending",
                  value: "pending",
                  color: "#FFC107",
                },
                {
                  text: "Failed",
                  value: "failed",
                  color: "#D32F2F",
                },
                {
                  text: "Cancelled",
                  value: "cancelled",
                  color: "#BDBDBD",
                },
                {
                  text: "Expired",
                  value: "expired",
                  color: "#FFA000",
                },
                {
                  text: "Success",
                  value: "success",
                  color: "#388E3C",
                },
              ],
            },
            readonly: true,
            sort: 2,
            width: "full",
          },
        },
        {
          field: "date_created",
          type: "timestamp",
          meta: {
            field: "date_created",
            special: ["date-created", "cast-timestamp"],
            interface: "datetime",
            display: "datetime",
            readonly: true,
            hidden: true,
            sort: 3,
            width: "full",
          },
        },
        {
          field: "merchant",
          type: "string",
          meta: {
            interface: "input",
            readonly: true,
            sort: 4,
            width: "full",
          },
        },
        {
          field: "amount",
          type: "integer",
          meta: {
            interface: "input",
            readonly: true,
            sort: 5,
            width: "full",
            required: true,
          },
        },
        {
          field: "description",
          type: "string",
          meta: {
            interface: "input",
            readonly: true,
            hidden: false,
            sort: 7,
            width: "full",
            required: true,
          },
        },
        {
          field: "return_url",
          type: "string",
          meta: {
            interface: "input",
            readonly: true,
            hidden: false,
            sort: 8,
            width: "full",
          },
        },
        {
          field: "customer",
          type: "string",
          meta: {
            interface: "input",
            readonly: true,
            hidden: false,
            sort: 9,
            width: "full",
          },
        },
        {
          field: "expires",
          type: "dateTime",
          meta: {
            interface: "datetime",
            readonly: true,
            hidden: false,
            sort: 10,
            width: "full",
            required: false,
          },
        },
        {
          field: "url",
          type: "string",
          meta: {
            interface: "input",
            readonly: true,
            hidden: false,
            sort: 11,
            width: "full",
            required: false,
          },
        },
        {
          field: "qr_code",
          type: "string",
          meta: {
            readonly: true,
            hidden: false,
            sort: 12,
            width: "full",
            required: false,
          },
        },
        {
          field: "currency",
          type: "string",
          meta: {
            interface: "select-dropdown",
            options: {
              choices: [
                {
                  text: "ANG",
                  value: "ANG",
                },
                {
                  text: "AWG",
                  value: "AWG",
                },
                {
                  text: "USD",
                  value: "USD",
                },
                {
                  text: "EUR",
                  value: "EUR",
                },
                {
                  text: "XCD",
                  value: "XCD",
                },
              ],
            },
            readonly: true,
            hidden: false,
            sort: 6,
            width: "full",
            required: false,
          },
        },
      ],
      schema: {},
      meta: {
        singleton: false,
        hidden: true,
        translations: [
          {
            language: "en-US",
            translation: "Sentoo Transactions",
            singular: "Sentoo Transaction",
            plural: "Sentoo Transactions",
          },
        ],
      },
    });

    const fieldsService = await this.createFieldsService();
    await fieldsService.createField("directus_settings", {
      collection: "directus_settings",
      field: "sentoo_devider",
      type: "alias",
      meta: {
        special: ["alias", "no-data"],
        interface: "presentation-divider",
        options: {
          title: "Sentoo Settings",
        },
        width: "full",
      },
    });

    await fieldsService.createField("directus_settings", {
      field: "sentoo_api_host",
      type: "string",
      meta: {
        interface: "select-dropdown",
        options: {
          choices: [
            {
              text: "https://api.sentoo.io (Production)",
              value: "https://api.sentoo.io",
            },
            {
              text: "https://api.sandbox.sentoo.io (Sandbox)",
              value: "https://api.sandbox.sentoo.io",
            },
          ],
        },
        width: "full",
        translations: [
          {
            language: "en-US",
            translation: "API Host",
          },
        ],
        required: true,
      },
    });
    await fieldsService.createField("directus_settings", {
      field: "sentoo_merchant_id",
      type: "string",
      meta: {
        interface: "input",
        width: "full",
        translations: [
          {
            language: "en-US",
            translation: "Merchant ID",
          },
        ],
        required: true,
      },
    });

    await fieldsService.createField("directus_settings", {
      field: "sentoo_merchant_secret",
      type: "string",
      meta: {
        interface: "input",
        options: {
          masked: true,
        },
        width: "full",
        translations: [
          {
            language: "en-US",
            translation: "Merchant Secret",
          },
        ],
        required: true,
      },
    });

    await fieldsService.createField("directus_settings", {
      field: "sentoo_default_currency",
      type: "string",
      meta: {
        interface: "select-dropdown",
        options: {
          choices: [
            {
              text: "ANG",
              value: "ANG",
            },
            {
              text: "AWG",
              value: "AWG",
            },
            {
              text: "USD",
              value: "USD",
            },
            {
              text: "EUR",
              value: "EUR",
            },
            {
              text: "XCD",
              value: "XCD",
            },
          ],
        },
        width: "full",
        translations: [
          {
            language: "en-US",
            translation: "Default Currency",
          },
        ],
        required: true,
      },
    });

    await fieldsService.createField("directus_settings", {
      field: "sentoo_default_return_url",
      type: "text",
      meta: {
        interface: "input",
        width: "full",
        translations: [
          {
            language: "en-US",
            translation: "Default Return URL",
          },
        ],
        note: 'The URL where Sentoo will return the customer after the payment process. The process status is concatenated with this URL. Examples:  https://merchant.com/payment/pending or https://merchant.com/?some_query_string=pending. In these two examples, the first part (https://merchant.com/?some_query_string=) is the return URL and the value of status “pending" is added by Sentoo.',
        required: true,
      },
    });
  }

  private async createCollectionService(): Promise<any> {
    const schema = await this.extensionContext.getSchema();
    return new this.extensionContext.services.CollectionsService({
      knex: this.extensionContext.database,
      schema: schema,
    });
  }

  private async createFieldsService(): Promise<any> {
    const schema = await this.extensionContext.getSchema();
    return new this.extensionContext.services.FieldsService({
      knex: this.extensionContext.database,
      schema: schema,
    });
  }
}
