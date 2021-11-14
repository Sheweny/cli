import { defaultHelp, addArgHelp, addHelp, createHelp } from "./functions";
import type { ICommand } from "../../typescript/interfaces/interfaces";
export function help(options: ICommand) {
  switch (options.arguments[0]?.toLowerCase()) {
    case "help":
      defaultHelp();
      break;
    case "create":
      createHelp();
      break;
    case "add":
      if (!options.arguments[1]) addHelp();
      else if (
        options.arguments[1] === "command" ||
        options.arguments[1] === "event" ||
        options.arguments[1] === "button" ||
        options.arguments[1] === "selectmenu" ||
        options.arguments[1] === "inhibitor"
      )
        addArgHelp(options);
      else addHelp();
      break;
    default:
      defaultHelp();
      break;
  }
}
