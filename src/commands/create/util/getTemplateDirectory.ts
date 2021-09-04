import { access } from "fs/promises";
import { constants } from "fs";
import { resolve } from "path";
import { ICreateOptions } from "../../../typescript/interfaces/interfaces";
import * as chalk from "chalk";
export async function getTemplateDirectory(
  options: ICreateOptions
): Promise<ICreateOptions> {
  try {
    const templateDir = resolve(
      require.main!.path,
      "../lib/templates/create",
      options.template!
    );
    await access(templateDir, constants.R_OK);
    options = {
      ...options,
      templateDirectory: templateDir,
    };
    return options;
  } catch (err) {
    console.log(
      `${chalk.red.bold("ERROR")} An error occurred while retrieving the template`
    );
    return process.exit(1);
  }
}
