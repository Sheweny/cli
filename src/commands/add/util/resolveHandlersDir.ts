import { IAddOptions } from "../../../typescript/interfaces/interfaces";

export function resolveHandlersDir(options: IAddOptions): string | undefined {
  if (
    options.addType === "command" &&
    (options.commandType === "ApplicationCommand" ||
      options.commandType === "MessageCommand")
  )
    return (
      options.config!.handlers?.commands ||
      options.config!.handlers?.applicationCommands ||
      options.config!.handlers?.messageCommands
    );

  if (options.addType === "event") return options.config!.handlers.events;
  if (options.addType === "button") return options.config!.handlers.buttons;
  if (options.addType === "selectmenu") return options.config!.handlers.selectMenus;
  if (options.addType === "inhibitor") return options.config!.handlers.inhibitors;
}
