import { IAddOptions } from "../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  function command(): string {
    if (options.commandType === "ApplicationCommand") {
      const importDjs =
        options.commandOptions!.applicationCommandType === "CHAT_INPUT"
          ? "CommandInteraction"
          : "ContextMenuInteraction";

      return `${
        options.config!.template === "javascript"
          ? `const { ApplicationCommand } = require("sheweny");`
          : `import { ApplicationCommand } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ${importDjs} } from "discord.js";`
      }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${
        options.addName
      }Command extends ApplicationCommand {
  constructor(client${
    options.config!.template === "typescript" ? ": ShewenyClient" : ""
  }) {
    super(
      client,
      {
        name: "${options.addName!.toLowerCase()}",
        description: "${options.commandOptions!.description}",
        type: "${options.commandOptions!.applicationCommandType}",
      },
      {
        category: "${options.commandOptions!.category}",
        cooldown: ${options.commandOptions!.cooldown},
        only: "${options.commandOptions!.only}",
      }
    );
  }

  async execute(interaction${
    options.config!.template === "typescript" ? `: ${importDjs}` : ""
  }) {
    await interaction.reply({ content: "Test" });
  }
};
`;
    } else
      return `${
        options.config!.template === "javascript"
          ? `const { MessageCommand } = require("sheweny");`
          : `import { MessageCommand, ShewenyClient } from "sheweny";
import type { Message } from "discord.js";`
      }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${
        options.addName
      }Command extends MessageCommand {
  constructor(client${
    options.config!.template === "typescript" ? ": ShewenyClient" : ""
  }) {
    super(client, "${options.addName}", {
      description: "${options.commandOptions!.description}",
      category: "${options.commandOptions!.category}",
      cooldown: ${options.commandOptions!.cooldown},
      only: ${
        options.commandOptions!.only ? `"${options.commandOptions!.only}"` : undefined
      },
    });
  }

  async execute(message${options.config!.template === "typescript" ? ": Message" : ""}) {
    await message.reply({ content: "Test" });
  }
};
`;
  }

  return command();
};
