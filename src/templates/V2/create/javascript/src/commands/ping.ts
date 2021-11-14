import { ICreateOptions } from "../../../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function superCommand(): string {
    return `super(client, {
        name: "ping",
        description: "Ping Pong",
        type: "SLASH_COMMAND",
        category : "Misc",
      }
    );`;
  }

  function execute(): string {
    return `async execute(interaction) {
    await interaction.reply({ content: "Pong" });
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
