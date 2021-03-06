import chalk from "chalk";
import Listr from "listr";
import { createTemplate, resolveHandlersDir, checkPath, getTemplateDirectory, getCliConfig } from "./util/index.js";
import type { IAddOptions } from "../../typescript/interfaces/interfaces";
export async function addTemplate(options: IAddOptions): Promise<any> {
  console.log("");

  const tasks = new Listr([
    {
      title: " āļø Getting CLI infos",
      task: async () => {
        options = await getCliConfig(options);
      },
    },
    {
      title: ` š§® Getting template for ${options.addType}`,
      task: async () => {
        options = await getTemplateDirectory(options);
      },
    },
    {
      title: " š Check if the path exists",
      task: async () => {
        if (resolveHandlersDir(options) === null) {
          console.log(`${chalk.red.bold("ERROR")} The path for ${options.addType!} handler is null\nChange cli-config.json to correct this`);
          return process.exit(1);
        }
        options = await checkPath(options);
      },
    },
    {
      title: ` šØļø Creating ${options.addType} template`,
      task: async () => {
        await createTemplate(options);
      },
    },
  ]);

  tasks
    .run()
    .then(() => {
      console.log(`\nš Successfully add ${chalk.blue(options.addType!)} template\n`);
    })
    .catch(() => {
      console.log(`${chalk.red.bold("ERROR")} An error has occurred`);
    });
}
