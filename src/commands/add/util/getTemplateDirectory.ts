import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import { IAddOptions } from "../../../typescript/interfaces/interfaces";
export async function getTemplateDirectory(options: IAddOptions): Promise<IAddOptions> {
  try {
    const templateDir = resolve(require.main!.path, "../lib/templates", `V${options.config?.version || "3"}`, "add", `${options.addType!}.js`);
    await access(templateDir, constants.R_OK);
    options = {
      ...options,
      templateDirectory: templateDir,
    };
    return options;
  } catch (err) {
    console.log(`${chalk.red.bold("ERROR")} The path for the ${options.addType!} template is not found`);
    return process.exit(1);
  }
}
