import chalk from "chalk";
import type { ICommand } from "../../../typescript/interfaces/interfaces";

export function addArgHelp(options: ICommand) {
  console.log(`
${chalk.blue("Sheweny command line interface : add", options.arguments[1])}
  
${chalk.green("Add a new component to your discord bot")}.

${chalk.yellow("Usage:")}
${chalk.magenta("sheweny")} add ${options.arguments[1]}

${chalk.yellow("Options:")}
[${chalk.grey("-y")}|${chalk.grey("--yes")}]
[${chalk.grey("-h")}|${chalk.grey("--help")}]`);
}
