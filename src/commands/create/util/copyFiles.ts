import { mkdir, readdir, stat, writeFile } from "fs/promises";
import { join } from "path";
import { ICreateOptions } from "../../../typescript/interfaces/interfaces";
import chalk from "chalk";

function checkFile(options: ICreateOptions, file: string) {
  const dirHandlers = ["events", "commands", "buttons", "selectmenus", "inhibitors"];
  if (file === "interactions" && !options.handlers?.includes("buttons") && !options.handlers?.includes("selectmenus")) return true;
  else if (dirHandlers.includes(file) && !options.handlers?.includes(file)) return true;
  return false;
}
export async function copyFiles(
  options: ICreateOptions,
  template: string = options.templateDirectory!,
  target: string = options.targetDirectory!
): Promise<void> {
  try {
    const templateFiles = await readdir(template);
    for (const file of templateFiles) {
      const fileStat = await stat(join(template, file));
      if (fileStat.isDirectory()) {
        if (checkFile(options, file)) continue;
        await mkdir(join(target, file));
        await copyFiles(options, join(template, file), join(target, file));
      } else {
        if (checkFile(options, file)) continue;
        const fileRead = await import(join(template, file));
        await writeFile(join(target, fileRead(options)[1]), fileRead(options)[0]);
      }
    }
  } catch (err) {
    console.error(err);
    console.log(`${chalk.red.bold("ERROR")} An error occurred while copying the files`);
    return process.exit(1);
  }
}
