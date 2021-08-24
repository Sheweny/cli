import { IAddOptions } from "../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  return `${
    options.config!.template === "javascript"
      ? `const { SelectMenu } = require("sheweny");`
      : `import { SelectMenu } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { SelectMenuInteraction } from "discord.js";`
  }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${
    options.addName
  }SelectMenu extends SelectMenu {
  constructor(client${
    options.config!.template === "typescript" ? ": ShewenyClient" : ""
  }) {
    super(client, []);
  }

  async execute(interaction${
    options.config!.template === "typescript" ? `: SelectMenuInteraction` : ""
  }) {
    await interaction.reply({ content: "Test" });
  }
};
`;
};
