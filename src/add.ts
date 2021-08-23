import { constants, existsSync } from "fs";
import { access, writeFile } from "fs/promises";
import { prompt } from "inquirer";
import * as Listr from "listr";
import { join, resolve } from "path";
import { IAddOptions, ICliConfig } from "./typescript/interfaces/interfaces";

export async function missingAddOptions(options: IAddOptions): Promise<IAddOptions> {
  if (options.skipPrompts)
    return {
      ...options,
      addName: "exampleTemplate",
    };

  const answers: any = await prompt([
    {
      type: "input",
      name: "addName",
      message: `Please choose the name for the ${options.addType}:`,
    },
    // COMMAND
    {
      type: "list",
      name: "commandType",
      message: "Please choose the type of command:",
      choices: ["MessageCommand", "ApplicationCommand"],
      default: "MessageCommand",
      when: () => options.addType === "command",
    },
    {
      type: "list",
      name: "applicationCommandType",
      message: "Please choose the type of Application Command:",
      choices: ["Slash Command", "Context Menu User", "Context Menu Message"],
      default: "Slash Command",
      when: (answers) =>
        options.addType === "command" && answers.commandType === "ApplicationCommand",
    },
    {
      type: "input",
      name: "commandDescription",
      message: "Please choose the description of the command:",
      when: () => options.addType === "command",
    },
    {
      type: "input",
      name: "commandCategory",
      message: "Please choose the category of the command:",
      when: () => options.addType === "command",
    },
    {
      type: "list",
      name: "commandOnly",
      message: "Please choose the command restriction:",
      choices: ["None", "DM", "GUILD"],
      default: "None",
      when: () => options.addType === "command",
    },
    {
      type: "number",
      name: "commandCooldown",
      message: "Please choose the cooldown of the command:",
      default: 0,
      when: () => options.addType === "command",
    },
    // EVENT
    {
      type: "input",
      name: "eventDescription",
      message: "Please choose the description of the event:",
      when: () => options.addType === "event",
    },
    {
      type: "confirm",
      name: "eventOnce",
      message: "Please choose if the event is once or not:",
      default: false,
      when: () => options.addType === "event",
    },
    // INHIBITOR
    {
      type: "checkbox",
      name: "inhibitorsTypes",
      message: "What types of inhibitors do you want to put ?",
      choices: ["MESSAGE_COMMAND", "APPLICATION_COMMAND", "BUTTON", "SELECT_MENU", "ALL"],
      when: () => options.addType === "inhibitor",
    },
  ]);

  return {
    ...options,
    addName: answers.addName || "exampleTemplate",
    commandType: answers.commandType,
    commandOptions: {
      applicationCommandType: applicationCommandType(answers.applicationCommandType),
      description: answers.commandDescription,
      category: answers.commandCategory,
      only: answers.commandOnly === "None" ? undefined : answers.commandOnly,
      cooldown: answers.commandCooldown,
    },
    eventOptions: {
      description: answers.eventDescription,
      once: answers.eventOnce,
    },
    inhibitorsTypes: answers.inhibitorsTypes,
  };
}

function applicationCommandType(
  type: string
): "CHAT_INPUT" | "USER" | "MESSAGE" | undefined {
  if (type === "Slash Command") return "CHAT_INPUT";
  if (type === "Context Menu User") return "USER";
  if (type === "Context Menu Message") return "MESSAGE";
  return undefined;
}

async function gettingCliInfos(options: IAddOptions): Promise<IAddOptions> {
  const pathFile = join(process.cwd(), "cli-config.json");

  const config: ICliConfig = await import(pathFile);
  options = {
    ...options,
    config,
  };
  return options;
}

function handlersDir(options: IAddOptions): string | undefined {
  if (options.addType === "command" && options.commandType === "ApplicationCommand")
    return options.config!.handlers.applicationCommands;
  if (options.addType === "command" && options.commandType === "MessageCommand")
    return options.config!.handlers.messageCommands;
  if (options.addType === "event") return options.config!.handlers.events;
  if (options.addType === "button") return options.config!.handlers.buttons;
  if (options.addType === "selectmenu") return options.config!.handlers.selectMenus;
  if (options.addType === "inhibitor") return options.config!.handlers.inhibitors;
}

async function getTemplateDirectory(options: IAddOptions): Promise<IAddOptions> {
  try {
    const templateDir = resolve(
      require.main!.path,
      "../lib/templates/add",
      `${options.addType!}.js`
    );
    await access(templateDir, constants.R_OK);
    options = {
      ...options,
      templateDirectory: templateDir,
    };
    return options;
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

async function renameFile(file: string, options: IAddOptions): Promise<string> {
  let fileName = `${file.toLowerCase()}${
    options.config!.template === "javascript" ? ".js" : ".ts"
  }`;
  const pathFile = join(options.target!, fileName);

  if (existsSync(pathFile)) {
    const reg = new RegExp(/\_[0-9]{1,2}/);
    const match = file.match(reg);
    if (match && match.index === file.length - match[0].length) {
      const number = parseInt(file.substring(match.index + 1, file.length)) + 1;
      file = file.replace(reg, `_${number}`);
      return renameFile(file, options);
    } else {
      file += "_1";
      return renameFile(file, options);
    }
  } else return fileName;
}

async function checkPath(options: IAddOptions): Promise<IAddOptions> {
  try {
    const pathDir = join(process.cwd(), handlersDir(options)!);
    await access(pathDir, constants.R_OK);
    options = {
      ...options,
      target: pathDir,
    };
    return options;
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

async function creatingTemplate(options: IAddOptions): Promise<void> {
  const file: string = ((await import(options.templateDirectory!)) as any)(options);
  let filename = await renameFile(options.addName!, options);
  const pathFile = join(options.target!, filename);
  await writeFile(pathFile, file);
}

export async function addTemplate(options: IAddOptions): Promise<any> {
  const tasks = new Listr([
    {
      title: "Getting CLI infos",
      task: async () => {
        options = await gettingCliInfos(options);
      },
    },
    {
      title: `Getting template for ${options.addType}`,
      task: async () => {
        options = await getTemplateDirectory(options);
      },
    },
    {
      title: "Check if the path exists",
      task: async () => {
        if (handlersDir(options) === null) {
          console.log("Folder not found");
          return process.exit(1);
        }
        options = await checkPath(options);
      },
    },
    {
      title: `Creating ${options.addType} template`,
      task: async () => {
        await creatingTemplate(options);
      },
    },
  ]);

  await tasks.run();
}
