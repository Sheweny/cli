import { writeFile } from "fs/promises";
import { resolve } from "path";
import { IAddOptions } from "../../../typescript/interfaces/interfaces";
import { renameFile } from "../../add/util/renameFile";

export async function createTemplate(options: IAddOptions): Promise<void> {
  const file: string = (await import(options.templateDirectory!))(options);
  const filename = await renameFile(options.addName!, options);
  const pathFile = resolve(options.target!, filename);
  await writeFile(pathFile, file);
}
