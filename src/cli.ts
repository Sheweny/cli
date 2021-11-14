import { Project } from "./commands/create";
import { Component } from "./commands/add";
import { help } from "./commands/help/index";
import { getArgs } from "./utils/getArgs";
import { magenta, red } from "chalk";
export async function cli(args: string[]): Promise<void> {
  const majorVersion = parseInt(process.version.split(".")[0]);
  const minorVersion = parseInt(process.version.split(".")[1]);

  if (majorVersion < 16) {
    console.log(`${red.bold("ERROR")} You must have nodejs 16.6.0 or higher for use discord.js V13 `);
    process.exit(1);
  } else if (majorVersion == 16 && minorVersion < 6) {
    console.log(`${red.bold("ERROR")} You must have nodejs 16.6.0 or higher for use discord.js V13 `);
    process.exit(1);
  }
  const options = await getArgs(args);
  console.log(options);

  switch (options.commandName) {
    case "help":
      await help(options);
      break;
    case "create":
      const project = new Project(options);
      const configCreate = await project.getConfig();
      await project.create(configCreate);
      break;
    case "add":
      const component = new Component(options);
      const configComponent = await component.getConfig();
      await component.create(configComponent);
      break;
    default:
      console.log(`${red.bold("ERROR")} Invalid command\nRun "${magenta("sheweny")} --help" for more informations`);
      process.exit(1);
  }
}
