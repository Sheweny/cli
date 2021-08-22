import { prompt } from "inquirer";
import { IAddOptions } from "./typescript/interfaces/interfaces";

export async function missingCreateOptions(options: IAddOptions) {
  // if (options.skipPrompts)
  //   return {
  //     ...options,
  //     dirName: options.dirName || "Project_Bot",
  //     template: "javascript",
  //   };

  // const answers = await prompt([
  //   {
  //     type: "input",
  //     name: "dirName",
  //     message: "Please choose the name of the project:",
  //     when: () => !options.dirName,
  //   },
  //   {
  //     type: "list",
  //     name: "template",
  //     message: "Please choose a language template",
  //     choices: ["Javascript", "Typescript"],
  //     default: "Javascript",
  //   },
  //   {
  //     type: "confirm",
  //     name: "runInstall",
  //     message: "Do you want install the packages ?",
  //     default: true,
  //   },
  //   {
  //     type: "list",
  //     name: "packageManager",
  //     message: "Which package manager do you want to install the packages with ?",
  //     choices: ["Npm", "Yarn"],
  //     default: "Npm",
  //     when: (answer) => answer.runInstall,
  //   },
  //   {
  //     type: "confirm",
  //     name: "git",
  //     message: "Do you want initialize git ?",
  //     default: false,
  //   },
  //   {
  //     type: "confirm",
  //     name: "putToken",
  //     message: "Do you want to add the token of your bot ?",
  //     default: true,
  //   },
  //   {
  //     type: "password",
  //     name: "token",
  //     message: "Please write your bot token:",
  //     when: (answers) => answers.putToken,
  //   },
  //   {
  //     type: "list",
  //     name: "commandType",
  //     message: "What kind of commands do you want ?",
  //     choices: ["MessageCommand", "ApplicationCommand"],
  //     default: "MessageCommand",
  //   },
  //   {
  //     type: "checkbox",
  //     name: "handlers",
  //     message: "Which handlers do you want to add ?",
  //     choices: ["Events", "Commands", "Buttons", "SelectMenus"],
  //   },
  //   {
  //     type: "list",
  //     name: "configFileType",
  //     message: "What type of configuration file do you want ?",
  //     choices: ["Json", "Yaml", "Toml"],
  //     default: "Json",
  //   },
  //   {
  //     type: "checkbox",
  //     name: "optionnalLibrary",
  //     message: "What optional libraries do you want to install ?",
  //     choices: ["discordjs/voice", "discordjs/builder"],
  //   },
  // ]);

  // return {
  //   ...options,
  //   dirName: options.dirName || answers.dirName,
  //   template: answers.template.toLowerCase(),
  //   packageManager: answers.packageManager
  //     ? answers.packageManager.toLowerCase()
  //     : undefined,
  //   token: answers.token,
  //   git: answers.git,
  //   commandType: answers.commandType,
  //   handlers: answers.handlers,
  //   configFileType: answers.configFileType.toLowerCase(),
  //   optionnalLibrary: answers.optionnalLibrary,
  // };
}

export async function createProject(options: IAddOptions): Promise<any> {
  console.log(options);
}
