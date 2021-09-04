import { join } from "path";
import { IAddOptions, ICliConfig } from "../../../typescript/interfaces/interfaces";

export async function getCliConfig(options: IAddOptions): Promise<IAddOptions> {
  const pathFile = join(process.cwd(), "cli-config.json");

  const config: ICliConfig = await import(pathFile);
  options = {
    ...options,
    config,
  };
  return options;
}
