import { prompt } from "inquirer";
import type { ICommand, IAddOptions, AddType } from "../../typescript/interfaces/interfaces";
import { renameCommandType } from "./util";
import * as Listr from "listr";
import * as chalk from "chalk";
import { readdir } from "fs/promises";
import { createTemplate, resolveHandlersDir, checkPath, getTemplateDirectory, getCliConfig } from "./util";
export class Component {
  /**
   * The options of the command
   * @param {ICommand} opts
   */
  public options: ICommand;
  /**
   * Config of the project
   * @param {IAddOptions} config
   */
  public config: IAddOptions = {};

  /**
   * @constructor
   * @param {ICommand} opts
   */
  constructor(opts: ICommand) {
    this.options = opts;
  }
  async init() {
    if (!(await readdir(process.cwd())).includes("cli-config.json")) {
      console.log(
        `${chalk.red.bold("ERROR")} cli-config not found. Please use ${chalk.blue(
          "sheweny init"
        )} for initialise the CLI with an existing project or use ${chalk.blue("sheweny create")} for create a new project.`
      );
      return process.exit(1);
    }
  }
  /**
   * Get the config parameters
   * @param options
   * @returns {Promise<IAddOptions>} -The config parameters
   */
  async getConfig(): Promise<IAddOptions> {
    if (this.options.skipPrompts)
      return {
        addName: "newcomponent",
        addType: ["command", "event", "inhibitor", "button", "selectmenu"].includes(this.options.arguments[0])
          ? (this.options.arguments[0] as AddType)
          : "command",
        commandOptions: {
          type: "SLASH_COMMAND",
          description: "New component !",
          cooldown: 0,
        },
      };

    console.log(`\n📜 Please answer the questionnaires to get a better result\n`);

    const answers: any = await prompt([
      {
        type: "list",
        choices: ["Command", "Events", "Inhibitors", "Buttons", "Selectmenus"],
        name: "addType",
        message: "What do you want to create ?",
      },
      {
        type: "input",
        name: "addName",
        message: `Please choose the name for the new component:`,
      },
      // COMMAND
      {
        type: "list",
        name: "commandType",
        message: "Please choose the type of Application Command:",
        choices: ["Slash Command", "Context Menu User", "Context Menu Message", "Message Command"],
        default: "Slash Command",
        when: (a) => a.addType.toLowerCase() === "command",
      },
      {
        type: "input",
        name: "commandDescription",
        message: "Please choose the description of the command:",
        when: (a) => a.addType.toLowerCase() === "command",
      },
      {
        type: "input",
        name: "commandCategory",
        message: "Please choose the category of the command:",
        when: (a) => a.addType.toLowerCase() === "command",
      },
      {
        type: "list",
        name: "commandOnly",
        message: "Please choose the command restriction:",
        choices: ["None", "DM", "GUILD"],
        default: "None",
        when: (a) => a.addType.toLowerCase() === "command",
      },
      {
        type: "number",
        name: "commandCooldown",
        message: "Please choose the cooldown of the command:",
        default: 0,
        when: (a) => a.addType.toLowerCase() === "command",
      },
      // EVENT
      {
        type: "input",
        name: "eventDescription",
        message: "Please choose the description of the event:",
        when: (a) => a.addType.toLowerCase() === "event",
      },
      {
        type: "confirm",
        name: "eventOnce",
        message: "Please choose if the event is once or not:",
        default: false,
        when: (a) => a.addType.toLowerCase() === "event",
      },
      // INHIBITOR
      {
        type: "checkbox",
        name: "inhibitorsTypes",
        message: "What types of inhibitors do you want to put ?",
        choices: ["MESSAGE_COMMAND", "APPLICATION_COMMAND", "BUTTON", "SELECT_MENU", "ALL"],
        when: (a) => a.addType.toLowerCase() === "inhibitor",
      },
    ]);

    this.config = {
      addType: answers.addType.toLowerCase(),
      addName: answers.addName || "exampleTemplate",
      commandOptions: {
        type: renameCommandType(answers.commandType),
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
    return this.config;
  }
  async create(config: IAddOptions): Promise<void> {
    if (!config) throw new Error("The config is null");
    const tasks = new Listr([
      {
        title: " ⚙️ Getting CLI infos",
        task: async () => {
          config = await getCliConfig(config);
        },
      },
      {
        title: ` 🧮 Getting template for ${config.addType}`,
        task: async () => {
          config = await getTemplateDirectory(config);
        },
      },
      {
        title: " 📁 Check if the path exists",
        task: async () => {
          if (resolveHandlersDir(config) === null) {
            console.log(`${chalk.red.bold("ERROR")} The path for ${config.addType!} handler is null\nChange cli-config.json to correct this`);
            return process.exit(1);
          }
          config = await checkPath(config);
        },
      },
      {
        title: ` 🖨️ Creating ${config.addType} template`,
        task: async () => {
          await createTemplate(config);
        },
      },
    ]);

    tasks
      .run()
      .then(() => {
        console.log(`\n🎉 Successfully add ${chalk.green(config.addType!)} template\n`);
      })
      .catch(() => {
        console.log(`${chalk.red.bold("ERROR")} An error has occurred`);
      });
  }
}
