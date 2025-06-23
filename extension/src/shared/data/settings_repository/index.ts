import Settings from "../../domain/settings";

export default interface SettingsRepository {
  getSettings(): Promise<Settings>;
}
