import { prompt } from "inquirer";
import { mkdir, access, readdir, stat, writeFile } from "fs/promises";
import { constants, existsSync } from "fs";
import { join, resolve } from "path";
import { ICreateOptions } from "../typescript/interfaces/interfaces";
import * as Listr from "listr";
import * as execa from "execa";
import * as chalk from "chalk";

export async function missingCreateOptions(
  options: ICreateOptions
): Promise<ICreateOptions> {
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

async function renameDirName(options: ICreateOptions): Promise<ICreateOptions> {
  if (options.dirName)
    options.dirName = options.dirName.replaceAll(
      /<|>|:|"|\/|\\|\||\?|\*|(^(aux|con|clock|nul|prn|com[1-9]|lpt[1-9])$)/gi,
      ""
    );
  const pathProject = join(process.cwd(), options.dirName!);

  if (existsSync(pathProject) || !options.dirName) {
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
    console.log(`${chalk.red.bold("ERROR")} An error occurred while creating the folder`);
    return process.exit(1);
  }
}

async function getTemplateDirectory(options: ICreateOptions): Promise<ICreateOptions> {
  try {
    const templateDir = resolve(
      require.main!.path,
      "../lib/templates/create",
      options.template!
    );
    await access(templateDir, constants.R_OK);
    options = {
      ...options,
      templateDirectory: templateDir,
    };
    return options;
  } catch (err) {
    console.log(
      `${chalk.red.bold("ERROR")} An error occurred while retrieving the template`
    );
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
    console.log(`${chalk.red.bold("ERROR")} An error occurred while copying the files`);
    return process.exit(1);
  }
}

async function addInfosPackageJson(options: ICreateOptions): Promise<void> {
  const filePath = join(options.targetDirectory!, "package.json");
  let file = {
    name: options.dirName,
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {},
    dependencies: {},
    devDependencies: {},
    keywords: [],
    author: "",
    license: "ISC",
  };
  const scriptsJs = options.optionnalLibrary?.includes("nodemon")
    ? {
        start: "node ./src/index.js",
        dev: "nodemon ./src/index.js",
      }
    : {
        start: "node ./src/index.js",
      };
  const scriptsTs = options.optionnalLibrary?.includes("ts-node-dev")
    ? {
        start: "node ./dist/index.js",
        dev: "tsnd --respawn --transpile-only --cls ./src/index.ts",
        build: "tsc",
      }
    : {
        start: "node ./dist/index.js",
        build: "tsc",
      };
  const dependencies = options.optionnalLibrary?.includes("@discordjs/voice")
    ? {
        "discord.js": "^13.1.0",
        sheweny: "1.0.0-beta.3",
        "@discordjs/voice": "*",
      }
    : {
        "discord.js": "^13.1.0",
        sheweny: "1.0.0-beta.3",
      };
  const devDependenciesJs = options.optionnalLibrary?.includes("nodemon")
    ? {
        nodemon: "*",
      }
    : {};
  const devDependenciesTs = options.optionnalLibrary?.includes("ts-node-dev")
    ? {
        typescript: "*",
        "ts-node-dev": "*",
      }
    : { typescript: "*" };
  if (options.template === "typescript") file.main = "dist/index.js";
  file.scripts = options.template === "javascript" ? scriptsJs : scriptsTs;
  file.dependencies = dependencies;
  file.devDependencies =
    options.template === "javascript" ? devDependenciesJs : devDependenciesTs;
  await writeFile(filePath, JSON.stringify(file, null, 2));
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
