export default abstract class Migration {
  abstract version: number;
  abstract description: string;
  abstract apply(): Promise<void>;
}
