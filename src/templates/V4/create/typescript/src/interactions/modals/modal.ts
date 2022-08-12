export default () => {
  return [
    `import { Modal } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ModalSubmitInteraction } from "discord.js";

export class ModalTest extends Modal {
  constructor(client: ShewenyClient) {
    super(client, ["modal-id"]);
  }
  
  async execute(modal: ModalSubmitInteraction) {
    modal.reply("Modal received.");
  }
};
`,
    "modal.ts",
  ];
};
