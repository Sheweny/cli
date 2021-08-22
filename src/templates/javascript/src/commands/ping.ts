import { ICreateOptions } from "../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function superCommand(): string {
    if (options.commandType === "ApplicationCommand")
      return `super(
      client,
      {
        name: "ping",
        description: "Ping Pong",
        type: "CHAT_INPUT",
      },
      {
        category: "Misc"
      }
    );`;
    else
      return `super(client, "ping", {
      description: "Ping Pong",
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
    `const { ${options.commandType} } = require("sheweny");

module.exports = class PingCommand extends ${options.commandType} {
  constructor(client) {
    ${superCommand()}
  }

  ${execute()}
};
`,
    "ping.js",
  ];
};
