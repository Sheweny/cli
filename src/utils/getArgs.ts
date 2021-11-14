import * as arg from "arg";
import * as chalk from "chalk";
import { ICommand } from "../typescript/interfaces/interfaces";
import { readdir } from "fs/promises";

export async function getArgs(rawArgs: string[]): Promise<ICommand> {
  const args = arg(
    {
      "--yes": Boolean,
      "--help": Boolean,
      "-y": "--yes",
      "-h": "--help",
    },
    {
      argv: rawArgs.slice(1),
    }
  );

  if (args["--help"])
    return {
      commandName: "help",
      arguments: args._.slice(1),
      skipPrompts: false,
    };

  const commandName: "create" | "add" | "help" | undefined = args._[1]
    ? (args._[1].toLowerCase() as "create" | "add" | "help")
    : undefined;

  let secondaryArg: string | undefined = args._[1];
  if (commandName === "add") {
    if (!(await readdir(process.cwd())).includes("cli-config.json")) {
      console.log(`${chalk.red.bold("ERROR")} cli-config not found`);
      return process.exit(1);
    }
    secondaryArg = secondaryArg ? secondaryArg.toLowerCase() : undefined;
    if (
      !secondaryArg ||
      (secondaryArg &&
        secondaryArg !== "command" &&
        secondaryArg !== "event" &&
        secondaryArg !== "button" &&
        secondaryArg !== "selectmenu" &&
        secondaryArg !== "inhibitor")
    ) {
      console.log(`${chalk.red.bold("ERROR")} Invalid command
Run "${chalk.yellow("sheweny")} --help add" for more informations`);
      return process.exit(1);
    }
  }

  return {
    commandName,
    skipPrompts: args["--yes"] || false,
    arguments: args._.slice(2),
  };
}
