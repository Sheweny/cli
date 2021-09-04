import { writeFile } from "fs/promises";
import { join } from "path";
import { ICreateOptions } from "../../../typescript/interfaces/interfaces";

export async function addInfosPackageJson(options: ICreateOptions): Promise<void> {
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
        sheweny: "^2.0.0-dev.3",
        "@discordjs/voice": "*",
      }
    : {
        "discord.js": "^13.1.0",
        sheweny: "^2.0.0-dev.3",
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
