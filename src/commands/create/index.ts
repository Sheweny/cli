import { prompt } from "inquirer";
import { ICreateOptions } from "../../typescript/interfaces/interfaces";
import * as Listr from "listr";
import * as execa from "execa";
import * as chalk from "chalk";
import {
  createDirProject,
  addInfosPackageJson,
  getTemplateDirectory,
  copyFiles,
} from "./util";
export async function getCreateOptions(options: ICreateOptions): Promise<ICreateOptions> {
  if (options.skipPrompts)
    return {
      ...options,
      dirName: options.dirName || "Project_Bot",
      template: "javascript",
      packageManager: "npm",
      handlers: ["Commands", "Events"],
      commandType: "ApplicationCommand",
      configFileType: "json",
    };

  console.log(`\n📜 Please answer the questionnaires to get a better result\n`);

  const answers = await prompt([
    {
      type: "input",
      name: "dirName",
      message: "Please choose the name of the project:",
      when: () => !options.dirName,
    },
    {
      type: "list",
      name: "template",
      message: "Please choose a language template",
      choices: ["Javascript", "Typescript"],
      default: "Javascript",
    },
    {
      type: "confirm",
      name: "runInstall",
      message: "Do you want install the packages ?",
      default: true,
    },
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager do you want to install the packages with ?",
      choices: ["Npm", "Yarn"],
      default: "Npm",
      when: (answer) => answer.runInstall,
    },
    {
      type: "checkbox",
      name: "optionnalLibrary",
      message: "What optional libraries do you want to install ?",
      choices: (answers) =>
        ["@discordjs/voice"].concat(
          answers.template === "Javascript" ? "nodemon" : "ts-node-dev"
        ),
    },
    {
      type: "confirm",
      name: "git",
      message: "Do you want initialize git ?",
      default: false,
    },
    {
      type: "confirm",
      name: "putToken",
      message: "Do you want to add the token of your bot ?",
      default: true,
    },
    {
      type: "password",
      name: "token",
      message: "Please write your bot token:",
      when: (answers) => answers.putToken,
    },
    {
      type: "checkbox",
      name: "handlers",
      message: "Which handlers do you want to add ?",
      choices: ["Events", "Commands", "Buttons", "SelectMenus", "Inhibitors"],
    },
    {
      type: "list",
      name: "commandType",
      message: "What kind of commands do you want ?",
      choices: ["MessageCommand", "ApplicationCommand"],
      default: "MessageCommand",
      when: (answers) => answers.handlers.includes("Commands"),
    },
    {
      type: "list",
      name: "configFileType",
      message: "What type of configuration file do you want ?",
      choices: (answers) => [
        "Json",
        `${answers.template === "Javascript" ? "JS" : "TS"}`,
      ],
      default: "Json",
    },
  ]);

  return {
    ...options,
    dirName: options.dirName || answers.dirName.replaceAll(" ", "_"),
    template: answers.template.toLowerCase(),
    packageManager: answers.packageManager
      ? answers.packageManager.toLowerCase()
      : undefined,
    token: answers.token,
    git: answers.git,
    handlers: (answers.handlers as string[]).map((e) => e.toLowerCase()),
    commandType: answers.commandType,
    configFileType: answers.configFileType.toLowerCase(),
    optionnalLibrary: answers.optionnalLibrary,
  };
}

export async function createProject(options: ICreateOptions): Promise<any> {
  const majorVersion = parseInt(process.version.split(".")[0]);
  const minorVersion = parseInt(process.version.split(".")[1]);

  if (majorVersion < 16) {
    console.log(
      `${chalk.red.bold(
        "ERROR"
      )} You must have nodejs 16.6.0 or higher for use discord.js V13 `
    );
    process.exit(1);
  } else if (majorVersion == 16 && minorVersion < 6) {
    console.log(
      `${chalk.red.bold(
        "ERROR"
      )} You must have nodejs 16.6.0 or higher for use discord.js V13 `
    );
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: " 📁 Creating Project folder",
      task: async () => {
        options = await createDirProject(options);
      },
    },
    {
      title: ` 🧮 Getting ${options.template!} template`,
      task: async () => {
        options = await getTemplateDirectory(options);
      },
    },
    {
      title: " ⚙️ Git init",
      enabled: () => options.git === true,
      task: async (ctx, task) => {
        const gitError = (await execa("git", ["--version"])).failed;

        if (gitError) {
          task.title = `${task.title} (or not)`;
          return task.skip("Git not available");
        }

        execa("git", ["init", options.dirName!]).then((res) => {
          if (res.failed) return task.skip("An error has occurred");
        });
      },
    },
    {
      title: " 📑 Creating package.json file",
      task: async (ctx, task) => {
        try {
          await addInfosPackageJson(options);
        } catch (err) {
          task.skip("An error has occurred");
        }
      },
    },
    {
      title: ` 🗃️ Install packages with yarn`,
      enabled: () => options.packageManager === "yarn",
      task: async (ctx, task) => {
        const yarnError = (await execa("yarn", ["--version"])).failed;

        if (options.packageManager === "yarn" && yarnError) {
          ctx.yarn = false;

          task.title = `${task.title} (or not)`;
          return task.skip("Yarn not available");
        }

        try {
          await execa("yarn", {
            cwd: options.targetDirectory,
          });
        } catch (err) {
          task.skip("An error has occurred");
        }
      },
    },
    {
      title: " 🗃️ Install packages with npm",
      enabled: (ctx) => options.packageManager === "npm" || ctx.yarn === false,
      task: async (ctx, task) => {
        try {
          await execa("npm", ["install"], {
            cwd: options.targetDirectory,
          });
        } catch (err) {
          task.skip("An error has occurred");
        }
      },
    },
    {
      title: ` 🖨️ Copying files`,
      task: async () => {
        await copyFiles(options);
      },
    },
  ]);

  tasks
    .run()
    .then(() => {
      console.log(
        `\n🎉 Successfully created project ${chalk.yellow(
          options.dirName!
        )} !\n👉 Get started with the following commands:\n\n ${chalk.grey(
          "$"
        )} ${chalk.blue(`cd ${options.dirName!}`)}\n${
          options.packageManager
            ? ` ${chalk.grey("$")} ${chalk.blue(`${options.packageManager!} start`)}\n`
            : ` ${chalk.grey("$")} ${chalk.blue(`npm install`)}\n`
        }`
      );
    })
    .catch(() => {
      console.log(`${chalk.red.bold("ERROR")} An error has occurred`);
    });
}
