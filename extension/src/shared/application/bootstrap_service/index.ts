import MetaRepository from "../../data/meta_repository";
import { logger } from "../../utils/logger";
import Migration from "./migration";

export default class BootstrapService {
  constructor(
    private metaRepository: MetaRepository,
    private migrations: Migration[]
  ) {}

  public async bootstrap(): Promise<void> {
    logger.info(`[Boncos Sentoo Extension] Starting bootstrap process...`);
    const appliedVersion =
      (await this.metaRepository.getAppliedVersion()) ?? -1;
    let maxVersion = appliedVersion;
    for (const migration of this.migrations) {
      if (migration.version > appliedVersion) {
        logger.info(
          `[Boncos Sentoo Extension] Applying migration: ${migration.description}`
        );
        await migration.apply();
        maxVersion = Math.max(maxVersion, migration.version);
      }
    }

    await this.metaRepository.setAppliedVersion(maxVersion);
    logger.info(
      `[Boncos Sentoo Extension] Bootstrap process completed. Applied version: ${maxVersion}`
    );
  }
}
