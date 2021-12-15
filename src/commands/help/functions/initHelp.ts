import chalk from "chalk";

export function initHelp() {
  console.log(`
${chalk.blue("Sheweny command line interface : init")}
  
${chalk.green("Initialize the cli for an existing project")}.    

${chalk.yellow("Usage:")}
${chalk.magenta("sheweny")} init


${chalk.yellow("Options:")}
[${chalk.grey("-h")}|${chalk.grey("--help")}]`);
}
