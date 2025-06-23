export default abstract class MetaRepository {
  abstract getAppliedVersion(): Promise<number | null>;
  abstract setAppliedVersion(version: number): Promise<void>;
}
