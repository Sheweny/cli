import { ICreateOptions } from "../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  const intents = options.commandType === "MessageCommand" ? `, "GUILD_MESSAGES"` : "";
  function handlers() {
    let result = "";

    if (options.handlers!.length > 0)
      result += `
  handlers: {`;
    if (options.handlers!.includes("commands")) {
      if (options.commandType === "MessageCommand")
        result += `
    messageCommands: {
      directory: "./commands",
      prefix: "!",
    },`;
      if (options.commandType === "ApplicationCommand")
        result += `
    applicationCommands: {
      directory: "./commands",
    },`;
    }
    if (options.handlers!.includes("events"))
      result += `
    events: {
      directory: "./events",
    },`;
    if (options.handlers!.includes("buttons"))
      result += `
    buttons: {
      directory: "./interactions/buttons",
    },`;
    if (options.handlers!.includes("selectmenus"))
      result += `
    selectMenus: {
      directory: "./interactions/selectmenus",
    },`;
    if (options.handlers!.includes("inhibitors"))
      result += `
    inhibitors: {
      directory: "./inhibitors",
    },`;
    if (options.handlers!.length > 0)
      result += `
  },`;

    return result;
  }

  return [
    `import { ShewenyClient } from "sheweny";
import config from "./config${options.configFileType === "json" ? ".json" : ""}";

const client = new ShewenyClient({
  intents: ["GUILDS"${intents}],${handlers()}
});

client.login(config.DISCORD_TOKEN);
`,
    "index.ts",
  ];
};
