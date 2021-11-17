import { readdir, writeFile } from "fs/promises";
import { red, grey, green } from "chalk";
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
      this.createConfig();
    });
  }
  async checkExistingConfig() {
    if ((await readdir(process.cwd())).includes("cli-config.json")) {
      console.log(`${red.bold("ERROR")} cli-config already exist in this project. You can modify it for change path of structures.`);
      process.exit(1);
    }
    return false;
  }
  async createConfig() {
    const config = {
      template: "javascript",
      version: 3,
      handlers: {
        commands: "src/commands",
        events: "src/events",
        inhibitors: "src/inhibitors",
        buttons: "src/buttons",
        selectMenus: "src/select-menus",
      },
    };
    await writeFile(`${process.cwd()}/cli-config.json`, JSON.stringify(config, null, 2));
    console.log(green(`🎉 Sheweny successfully initialized !`));
    console.log(`You can now run ${grey("sheweny add")} to create your first component with ths CLI.`);
    console.log(`If you add or change a directory name please update manualy the file cli-config.json `);
    return true;
  }
}
