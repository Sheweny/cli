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
    commands: {
      directory: "./commands",
      prefix: "!",
    },`;
      if (options.commandType === "ApplicationCommand")
        result += `
    commands: {
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
    `const { ShewenyClient } = require("sheweny");
const config = require("../config${options.configFileType === "json" ? ".json" : ""}");

const client = new ShewenyClient({
  intents: ["GUILDS"${intents}],${handlers()}
  mode : "development", // Change to production for production bot
});

client.login(config.DISCORD_TOKEN);
`,
    "index.js",
  ];
};
