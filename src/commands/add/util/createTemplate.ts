import { writeFile } from "fs/promises";
import { join } from "path";
import { IAddOptions } from "../../../typescript/interfaces/interfaces";
import { renameFile } from "../../add/util/renameFile";

export async function createTemplate(options: IAddOptions): Promise<void> {
  const file: string = ((await import(options.templateDirectory!)) as any)(options);
  let filename = await renameFile(options.addName!, options);
  const pathFile = join(options.target!, filename);
  await writeFile(pathFile, file);
}
