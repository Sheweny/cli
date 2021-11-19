import { IAddOptions } from "../../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  return `${
    options.config!.template === "javascript"
      ? `const { Event } = require("sheweny");`
      : `import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";`
  }

${options.config!.template === "javascript" ? "module.exports =" : "export"} class ${options.addName}Event extends Event {
  constructor(client${options.config!.template === "typescript" ? ": ShewenyClient" : ""}) {
    super(client, "${options.addName!}", {
      description: ${JSON.stringify(options.eventOptions?.description || "Default description")},
      once: ${JSON.stringify(options.eventOptions?.once || false)},
    });
  }

  execute() {
    console.log("Event called !");
  }
};
`;
};
