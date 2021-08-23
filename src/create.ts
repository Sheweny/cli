import { prompt } from "inquirer";
import { mkdir, access, readdir, stat, writeFile, readFile } from "fs/promises";
import { constants, existsSync } from "fs";
import { join, resolve, extname } from "path";
// import chalk from "chalk";
import { ICreateOptions } from "./typescript/interfaces/interfaces";
import * as Listr from "listr";
import * as execa from "execa";

export async function missingCreateOptions(
  options: ICreateOptions
): Promise<ICreateOptions> {
  if (options.skipPrompts)
    return {
      ...options,
      dirName: options.dirName || "Project_Bot",
      template: "javascript",
    };

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
      when: (answers) => answers.runInstall,
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
    dirName: options.dirName || answers.dirName,
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

async function renameDirName(options: ICreateOptions): Promise<ICreateOptions> {
  const pathProject = join(process.cwd(), options.dirName!);
  if (existsSync(pathProject)) {
    const reg = new RegExp(/\_[0-9]{1,2}/);
    const match = options.dirName!.match(reg);
    if (match && match.index === options.dirName!.length - match[0].length) {
      const number =
        parseInt(options.dirName!.substring(match.index + 1, options.dirName!.length)) +
        1;
      options = {
        ...options,
        dirName: options.dirName!.replace(reg, `_${number}`),
      };
      return renameDirName(options);
    } else {
      options.dirName += "_1";
      return renameDirName(options);
    }
  } else return options;
}

async function createDirProject(options: ICreateOptions): Promise<ICreateOptions> {
  try {
    options = await renameDirName(options);
    const pathDir = join(process.cwd(), options.dirName!);
    await mkdir(pathDir);
    options = {
      ...options,
      targetDirectory: pathDir,
    };
    return options;
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

async function getTemplateDirectory(options: ICreateOptions): Promise<ICreateOptions> {
  try {
    const templateDir = resolve(
      require.main!.path,
      "../lib/templates",
      options.template!
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

function checkFile(options: ICreateOptions, file: string) {
  const dirHandlers = ["events", "commands", "buttons", "selectmenus", "inhibitors"];
  if (
    file === "interactions" &&
    !options.handlers?.includes("buttons") &&
    !options.handlers?.includes("selectmenus")
  )
    return true;
  else if (dirHandlers.includes(file) && !options.handlers?.includes(file)) return true;
  return false;
}

async function copyFiles(
  options: ICreateOptions,
  template: string = options.templateDirectory!,
  target: string = options.targetDirectory!
): Promise<void> {
  try {
    const templateFiles = await readdir(template);
    for (const file of templateFiles) {
      const fileStat = await stat(join(template, file));
      if (fileStat.isDirectory()) {
        if (checkFile(options, file)) continue;
        await mkdir(join(target, file));
        await copyFiles(options, join(template, file), join(target, file));
      } else {
        if (checkFile(options, file)) continue;
        const fileRead = await import(join(template, file));
        await writeFile(join(target, fileRead(options)[1]), fileRead(options)[0]);
      }
    }
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
}

async function addScriptsPackage(options: ICreateOptions): Promise<void> {
  const filePath = join(options.targetDirectory!, "package.json");
  let file = (await readFile(filePath)).toString();
  const scripts = `${
    options.packageManager === "yarn" ? `"license": "MIT",` : ""
  }  "scripts": {
    "start": "node ./src/index${options.template === "javascript" ? ".js" : ".ts"}"${
    options.optionnalLibrary?.includes("nodemon")
      ? `,
    "dev": "nodemon ./src/index.js"`
      : options.optionnalLibrary?.includes("ts-node-dev")
      ? `,
    "dev": "tsnd --respawn --transpile-only --cls ./src/index.ts`
      : ""
  }
  }${
    options.packageManager === "yarn"
      ? `
}`
      : ","
  }`;
  if (options.template === "typescript")
    file = file.replace(`  "main": "index.js",`, `  "main": "dist/index.js",`);
  file =
    options.packageManager === "yarn"
      ? file.replace(
          `  "license": "MIT"
}`,
          scripts
        )
      : file.replace(
          `  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },`,
          scripts
        );
  await writeFile(filePath, file);
}

export async function createProject(options: ICreateOptions): Promise<any> {
  const tasks = new Listr([
    {
      title: "Creating Project folder",
      task: async () => {
        options = await createDirProject(options);
      },
    },
    {
      title: `Getting ${options.template!} template`,
      task: async () => {
        options = await getTemplateDirectory(options);
      },
    },
    {
      title: "Git init",
      enabled: () => options.git === true,
      task: async (ctx, task) => {
        const gitError = (await execa("git", ["--version"])).failed;

        if (gitError) {
          task.title = `${task.title} (or not)`;
          return task.skip("Git not available");
        }

        execa("git", ["init"]).then((res) => {
          if (res.failed) return task.skip("An error has occurred");
        });
      },
    },
    {
      title: "Creating package.json file",
      task: async () => {
        const yarnError = (await execa("yarn", ["--version"])).failed;

        if (options.packageManager === "yarn" && yarnError) {
          await execa("npm", ["init", "-y"], {
            cwd: options.targetDirectory,
          });
        } else if (options.packageManager === "yarn" && !yarnError) {
          await execa("yarn", ["init", "-y"], {
            cwd: options.targetDirectory,
          });
        } else {
          await execa("npm", ["init", "-y"], {
            cwd: options.targetDirectory,
          });
        }
      },
    },
    {
      title: `Install packages with ${options.packageManager}`,
      enabled: () => options.packageManager !== undefined,
      task: async (ctx, task) => {
        const yarnError = (await execa("yarn", ["--version"])).failed;

        if (options.packageManager === "yarn" && yarnError) {
          ctx.yarn = false;

          task.title = `${task.title} (or not)`;
          return task.skip("Yarn not available");
        }

        try {
          await addScriptsPackage(options);
          await execa(
            "yarn",
            ["add", "discord.js@13.1.0"].concat(options.optionnalLibrary!),
            {
              cwd: options.targetDirectory,
            }
          );
        } catch (err) {
          task.skip("An error has occurred");
        }
      },
    },
    {
      title: "Install packages with npm",
      enabled: (ctx) => options.packageManager !== undefined && ctx.yarn === false,
      task: async (ctx, task) => {
        try {
          await addScriptsPackage(options);
          await execa(
            "npm",
            ["install", "--save", "discord.js@13.1.0"].concat(options.optionnalLibrary!),
            {
              cwd: options.targetDirectory,
            }
          );
        } catch (err) {
          task.skip("An error has occurred");
        }
      },
    },
    {
      title: `Copying files`,
      task: async () => {
        await copyFiles(options);
      },
    },
  ]);

  await tasks.run();
}
