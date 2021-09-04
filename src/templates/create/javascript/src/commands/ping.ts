import { ICreateOptions } from "../../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function superCommand(): string {
    if (options.commandType === "ApplicationCommand")
      return `super(client, {
        name: "ping",
        description: "Ping Pong",
        type: "SLASH_COMMAND",
        category : "Misc",
      }
    );`;
    else
      return `super(client, {
      name : "ping",
      description: "Ping Pong",
      type: "MESSAGE_COMMAND",
      category: "Misc",
    });`;
  }

  function execute(): string {
    if (options.commandType === "ApplicationCommand")
      return `async execute(interaction) {
    await interaction.reply({ content: "Pong" });
  }`;
    else
      return `async execute(message, args) {
    await message.channel.send({ content: "Pong" });
  }`;
  }

  return [
    `const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    ${superCommand()}
  }

  ${execute()}
};
`,
    "ping.js",
  ];
};
