import { ICreateOptions } from "../../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function importP(): string {
    if (options.commandType === "ApplicationCommand")
      return `import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js"`;
    else
      return `import { Command } from "sheweny";
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
        type: "SLASH_COMMAND",
        category: "Misc"
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

export class PingCommand extends Command {
  constructor(client: ShewenyClient) {
    ${superCommand()}
  }

  ${execute()}
};
`,
    "ping.ts",
  ];
};
