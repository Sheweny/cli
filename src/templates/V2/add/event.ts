import { IAddOptions } from "../../../typescript/interfaces/interfaces";

export = (options: IAddOptions) => {
  return `import {Event} from "";
      description : ${options.eventOptions?.description},
 `;
};
