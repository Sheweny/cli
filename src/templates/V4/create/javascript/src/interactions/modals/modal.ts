export default () => {
  return [
    `const { Modal } = require("sheweny");
  
module.exports = class ModalTest extends Modal {
  constructor(client) {
    super(client, ["modalId"]);
  }
  
  async execute(modal) {
    console.log("Modal submitted!");
  }
};
`,
    "modal.js",
  ];
};
