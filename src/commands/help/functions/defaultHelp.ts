import * as chalk from "chalk";

export function defaultHelp() {
  return console.log(`${chalk.blue(
    String.raw`
  ____   _                                        
 / ___| | |__    ___ __      __ ___  _ __   _   _ 
 \___ \ | '_ \  / _ \\ \ /\ / // _ \| '_ \ | | | |
  ___) || | | ||  __/ \ V  V /|  __/| | | || |_| |
 |____/ |_| |_| \___|  \_/\_/  \___||_| |_| \__, |
                                            |___/ 
`
  )}
${chalk.green("Welcome to the command line interface of Sheweny framework.")}

${chalk.yellow("Prefixes:")}
- ${chalk.magenta("sheweny")}
- ${chalk.magenta("shw")}

${chalk.yellow("Usage:")} 
- ${chalk.magenta("sheweny")} <command> [options]

${chalk.yellow("Commands:")}
- ${chalk.magenta("sheweny")} create [project_name]
- ${chalk.magenta("sheweny")} add <add_type>

`);
}
