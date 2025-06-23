import BootstrapService from "./application/bootstrap_service";
import DirectusMetaRepository from "./data/meta_repository/directus_meta_repository";
import DirectusMigration00000001InitTransactionsTable from "./data/migrations/directus_00000001-init";
import { ApiExtensionContext } from "@directus/extensions";
import { setLogger } from "./utils/logger";
import DirectusTransactionsRepository from "./data/transactions_repository/directus_transactions_repository";
import TransactionService from "./application/transaction_service";
import DirectusSentooPaymentGateway from "./data/payment_gateway/directus_sentoo_payment_gateway";
import DirectusSettingsRepository from "./data/settings_repository/directus_settings_repository";
import Migration from "./application/bootstrap_service/migration";

export class App {
  constructor(
    public readonly bootstrapService: BootstrapService,
    public readonly transactionsService: TransactionService
  ) {}

  static fromDirectusContext(context: ApiExtensionContext): App {
    setLogger(context.logger);

    const metaRepository = new DirectusMetaRepository(context);
    const migrations: Migration[] = [
      new DirectusMigration00000001InitTransactionsTable(context),
    ];
    const bootstrapService = new BootstrapService(metaRepository, migrations);

    const settingsRepository = new DirectusSettingsRepository(context);
    const paymentsGateway = new DirectusSentooPaymentGateway(
      settingsRepository
    );

    const transactionsRepository = new DirectusTransactionsRepository(context);
    const transactionService = new TransactionService(
      transactionsRepository,
      paymentsGateway
    );
    return new App(bootstrapService, transactionService);
  }
}
