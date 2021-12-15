import { readdir, writeFile } from "fs/promises";
import chalk from "chalk";
import * as inquirer from "inquirer";

/**
 * Export a function for create a json file
 * The file name is cli-config.json
 * Structure of json :
 * {
 * "template": "javascript",
 * "version": 3,
 * "handlers": {
 *  "commands": "src/commands",
 *  "events": "src/events",
 *  "inhibitors": "src/inhibitors",
 *  "buttons": "src/buttons",
 *  "selectMenus": "src/select-menus"
 *  }
 * }
 */

export class Init {
  constructor() {
    this.checkExistingConfig().then(() => {
      this.getOpts().then((opts) => {
        this.createConfig(opts);
      });
    });
  }
  async checkExistingConfig() {
    if ((await readdir(process.cwd())).includes("cli-config.json")) {
      console.log(`${chalk.red.bold("ERROR")} cli-config already exist in this project. You can modify it for change path of structures.`);
      process.exit(1);
    }
    return false;
  }
  async getOpts() {
    return await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Select a language",
        choices: ["javascript", "typescript"],
      },
      {
        type: "list",
        name: "version",
        message: "What is the of Sheweny ?",
        choices: ["2", "3"],
      },
    ]);
  }
  async createConfig(opts: { template?: string; version?: number } = {}) {
    const config = {
      template: opts.template || "javascript",
      version: opts.version || 3,
      handlers: {
        commands: "src/commands",
        events: "src/events",
        inhibitors: "src/inhibitors",
        buttons: "src/buttons",
        selectMenus: "src/select-menus",
      },
    };
    await writeFile(`${process.cwd()}/cli-config.json`, JSON.stringify(config, null, 2));
    console.log(chalk.green(`🎉 Sheweny successfully initialized !`));
    console.log(`You can now run ${chalk.grey("sheweny add")} to create your first component with ths CLI.`);
    console.log(`If you add or change a directory name please update manualy the file cli-config.json `);
    return true;
  }
}
