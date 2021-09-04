import * as arg from "arg";
import * as chalk from "chalk";
import { createProject, getCreateOptions } from "./commands/create";
import { createTemplate } from "./commands/add/util";
import { getAddOptions } from "./commands/add/util/getOptions";
import { ICreateOptions, IAddOptions } from "./typescript/interfaces/interfaces";
import { readdir } from "fs/promises";
import { executeHelp } from "./commands/help";

async function getArgs(rawArgs: string[]): Promise<ICreateOptions | IAddOptions> {
  const args = arg(
    {
      "--yes": Boolean,
      "--help": Boolean,
      "-y": "--yes",
      "-h": "--help",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  if (args["--help"])
    return {
      help: args["--help"],
      executeType: args._[0] as "create" | "add",
      addType: args._[1] as "command" | "event" | "button" | "selectmenu" | "inhibitor",
    };

  const executeType: "create" | "add" | undefined = args._[0]
    ? (args._[0].toLowerCase() as "create" | "add")
    : undefined;
  if (
    !executeType ||
    (executeType && executeType !== "create" && executeType !== "add")
  ) {
    console.log(`${chalk.red.bold("ERROR")} Invalid command
Run "${chalk.yellow("sheweny")} --help" for more informations`);
    return process.exit(1);
  }

  let secondaryArg: string | undefined = args._[1];
  if (executeType === "add") {
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
    executeType,
    help: args["--help"] || false,
    skipPrompts: args["--yes"] || false,
    dirName:
      executeType === "create" ? args._.filter((v, i) => i !== 0).join("_") : undefined,
    addType:
      executeType === "add"
        ? (secondaryArg as "command" | "event" | "button" | "selectmenu" | "inhibitor")
        : undefined,
  };
}

export async function cli(args: string[]): Promise<void> {
  let options = await getArgs(args);
  if (options.help)
    return executeHelp(options.executeType!, (options as IAddOptions).addType!);
  if (options.executeType === "create") {
    options = await getCreateOptions(options);
    await createProject(options);
  } else if (options.executeType === "add") {
    options = await getAddOptions(options);
    await createTemplate(options);
  }
}
