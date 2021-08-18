import * as arg from "arg";
import chalk = require("chalk");
import { IOptions } from "./typescript/interfaces/interfaces";

function getArgs(rawArgs: string[]): IOptions {
  const args = arg(
    {
      "--yes": Boolean,
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  const executeType = args._[0].toLowerCase();
  if (executeType !== "create" && executeType !== "add") {
    console.log(`${chalk.red.bold("ERROR")} No type execute`);
    return process.exit(1);
  }

  let secondaryArg = args._[1];
  if (executeType === "add") {
    secondaryArg = secondaryArg.toLowerCase();
    if (secondaryArg !== "command" && secondaryArg !== "event") {
      console.log(`${chalk.red.bold("ERROR")} Invalid type add`);
      return process.exit(1);
    }
  }

  return {
    executeType,
    skipPrompts: args["--yes"] || false,
    dirName: executeType === "create" ? secondaryArg : undefined,
    addType: executeType === "add" ? secondaryArg : undefined,
  };
}

export async function cli(args: string[]): Promise<void> {
  let options = getArgs(args);
  console.log(options);
}
