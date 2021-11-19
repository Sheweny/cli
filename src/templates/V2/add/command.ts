import { IAddOptions } from "../../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  console.log(options);

  function command(): string {
    const importDjs = options.commandOptions!.type === "SLASH_COMMAND" ? "CommandInteraction" : "ContextMenuInteraction";

    return `${
      options.config!.template === "javascript"
        ? `const { Command } = require("sheweny");`
        : `import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ${importDjs} } from "discord.js";`
    }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${options.addName}Command extends Command {
  constructor(client${options.config!.template === "typescript" ? ": ShewenyClient" : ""}) {
    super(
      client,
      {
        name: ${JSON.stringify(options.addName!.toLowerCase() || "default")},
        description: ${JSON.stringify(options.commandOptions!.description || "Default description")},
        type: ${JSON.stringify(options.commandOptions!.type || "SLASH_COMMAND")},
        ${options.commandOptions!.category ? `category: "${options.commandOptions!.category}",` : ""}
        cooldown: ${JSON.stringify(options.commandOptions!.cooldown || 0)},
        ${options.commandOptions!.category ? `channel: "${options.commandOptions!.only}",` : ""}
      }
    );
  }

  async execute(interaction${options.config!.template === "typescript" ? `: ${importDjs}` : ""}) {
    await interaction.reply({ content: "Pong" });
  }
};
`;
  }
  return command();
};
