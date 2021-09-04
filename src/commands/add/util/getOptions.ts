import { prompt } from "inquirer";
import { IAddOptions } from "../../../typescript/interfaces/interfaces";
import { applicationCommandType } from "./applicationCommandType";
export async function getAddOptions(options: IAddOptions): Promise<IAddOptions> {
  if (options.skipPrompts)
    return {
      ...options,
      addName: "exampleTemplate",
      commandType: "MessageCommand",
    };

  console.log(`\n📜 Please answer the questionnaires to get a better result\n`);

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
