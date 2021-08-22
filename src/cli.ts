import * as arg from "arg";
import * as chalk from "chalk";
import { createProject, missingCreateOptions } from "./create";
import { ICreateOptions, IAddOptions } from "./typescript/interfaces/interfaces";

function getArgs(rawArgs: string[]): ICreateOptions | IAddOptions {
  const args = arg(
    {
      "--yes": Boolean,
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  const executeType: "create" | "add" | undefined = args._[0]
    ? (args._[0].toLowerCase() as "create" | "add")
    : undefined;
  if (
    !executeType ||
    (executeType && executeType !== "create" && executeType !== "add")
  ) {
    console.log(`${chalk.red.bold("ERROR")} No type execute`);
    return process.exit(1);
  }

  let secondaryArg: string | undefined = args._[1];
  if (executeType === "add") {
    secondaryArg = secondaryArg ? secondaryArg.toLowerCase() : undefined;
    if (
      !secondaryArg ||
      (secondaryArg && secondaryArg !== "command" && secondaryArg !== "event")
    ) {
      console.log(`${chalk.red.bold("ERROR")} Invalid type add`);
      return process.exit(1);
    }
  }

  return {
    executeType,
    skipPrompts: args["--yes"] || false,
    dirName: executeType === "create" ? secondaryArg : undefined,
    addType: executeType === "add" ? (secondaryArg as "command" | "event") : undefined,
  };
}

export async function cli(args: string[]): Promise<void> {
  let options = getArgs(args);
  if (options.executeType === "create") {
    options = await missingCreateOptions(options);
    await createProject(options);
  } else if (options.executeType === "add") {
  }
}
