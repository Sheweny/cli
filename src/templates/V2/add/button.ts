import { IAddOptions } from "../../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  return `${
    options.config!.template === "javascript"
      ? `const { Button } = require("sheweny");`
      : `import { Button, ShewenyClient } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ButtonInteraction } from "discord.js";`
  }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${options.addName}Button extends Button {
  constructor(client${options.config!.template === "typescript" ? ": ShewenyClient" : ""}) {
    super(client, []);
  }

  async execute(interaction${options.config!.template === "typescript" ? `: ButtonInteraction` : ""}) {
    await interaction.reply({ content: "Test" });
  }
};
`;
};
