export default () => {
  return [
    `const { Modal } = require("sheweny");

export class ModalComponent extends Modal {
  constructor(client) {
    super(client, ["modal-id"]);
  }
  
  async execute(modal) {
    modal.reply("Modal received.");
  }
};
`,
    "modal.js",
  ];
};
