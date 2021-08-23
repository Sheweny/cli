import { ICreateOptions } from "../../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function importP(): string {
    if (options.commandType === "ApplicationCommand")
      return `import { ApplicationCommand } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js"`;
    else
      return `import { MessageCommand } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { Message } from "discord.js"`;
  }

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
      return `async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: "Pong" });
  }`;
    else
      return `async execute(message: Message, args: string[]) {
    await message.channel.send({ content: "Pong" });
  }`;
  }

  return [
    `${importP()}

export class PingCommand extends ${options.commandType} {
  constructor(client: ShewenyClient) {
    ${superCommand()}
  }

  ${execute()}
};
`,
    "ping.ts",
  ];
};
