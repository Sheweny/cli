import { ICreateOptions } from "../../../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  function importP(): string {
    return `import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { Message } from "discord.js"`;
  }

  function superCommand(): string {
    return `super(client,
      {
        name: "ping",
        description: "Ping Pong",
        type: "SLASH_COMMAND",
        category: "Misc"
      }
    );`;
  }

  function execute(): string {
    return `async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: "Pong" });
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
