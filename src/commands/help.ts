import * as chalk from "chalk";

export function executeHelp(executeType: string, addType: string) {
  if (!executeType && !addType)
    return console.log(`${chalk.yellow("sheweny")} <command>
  
Prefix:
${chalk.yellow("sheweny")}
${chalk.yellow("shw")}

Usage:
${chalk.yellow("sheweny")} create [project_name]
${chalk.yellow("sheweny")} add <add_type>

@shewent/cli@1.0.0`);

  if (executeType === "create")
    return console.log(`${chalk.yellow("sheweny")} create
  
Create a project

Usage:
${chalk.yellow("sheweny")} create [project_name]

Options:
[${chalk.grey("-y")}|${chalk.grey("--yes")}]
[${chalk.grey("-h")}|${chalk.grey("--help")}]`);

  if (executeType === "add") {
    if (!addType)
      return console.log(`${chalk.yellow("sheweny")} add
    
Add a template command or event or etc...

Usage:
${chalk.yellow("sheweny")} add <add_type>

Add types:
- command
- event
- button
- selectmenu
- inhibitor

Options:
[${chalk.grey("-y")}|${chalk.grey("--yes")}]
[${chalk.grey("-h")}|${chalk.grey("--help")}]`);
    else if (
      addType === "command" ||
      addType === "event" ||
      addType === "button" ||
      addType === "selectmenu" ||
      addType === "inhibitor"
    )
      return console.log(`${chalk.yellow("sheweny")} add ${addType}

Add a template ${addType}

Usage:
${chalk.yellow("sheweny")} add ${addType}

Options:
[${chalk.grey("-y")}|${chalk.grey("--yes")}]
[${chalk.grey("-h")}|${chalk.grey("--help")}]`);
    else
      return console.log(`${chalk.red("Command not found")}
    
Run "${chalk.yellow("sheweny")} add --help" for more informations`);
  }

  if (executeType !== "create" && executeType !== "add")
    return console.log(`${chalk.red("Command not found")}
    
Run "${chalk.yellow("sheweny")} --help" for more informations`);
}
