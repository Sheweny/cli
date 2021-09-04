import * as chalk from "chalk";
import * as Listr from "listr";
import { IAddOptions } from "../../typescript/interfaces/interfaces";
import { getCliConfig } from "./util/getCliConfig";
import { getTemplateDirectory } from "./util/getTemplateDirectory";
import { checkPath } from "./util/checkPath";
import { resolveHandlersDir } from "./util/resolveHandlersDir";
import { createTemplate } from "./util/createTemplate";
export async function addTemplate(options: IAddOptions): Promise<any> {
  console.log("");

  const tasks = new Listr([
    {
      title: " ⚙️ Getting CLI infos",
      task: async () => {
        options = await getCliConfig(options);
      },
    },
    {
      title: ` 🧮 Getting template for ${options.addType}`,
      task: async () => {
        options = await getTemplateDirectory(options);
      },
    },
    {
      title: " 📁 Check if the path exists",
      task: async () => {
        if (resolveHandlersDir(options) === null) {
          console.log(
            `${chalk.red.bold(
              "ERROR"
            )} The path for ${options.addType!} handler is null\nChange cli-config.json to correct this`
          );
          return process.exit(1);
        }
        options = await checkPath(options);
      },
    },
    {
      title: ` 🖨️ Creating ${options.addType} template`,
      task: async () => {
        await createTemplate(options);
      },
    },
  ]);

  tasks
    .run()
    .then(() => {
      console.log(`\n🎉 Successfully add ${chalk.green(options.addType!)} template\n`);
    })
    .catch(() => {
      console.log(`${chalk.red.bold("ERROR")} An error has occurred`);
    });
}
