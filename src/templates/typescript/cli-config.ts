import { ICreateOptions } from "../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  const applicationCommands =
    options.handlers!.includes("commands") && options.commandType === "ApplicationCommand"
      ? `"./commands"`
      : undefined;
  const messageCommands =
    options.handlers!.includes("commands") && options.commandType === "MessageCommand"
      ? `"./commands"`
      : undefined;
  const events = options.handlers!.includes("events") ? `"./events"` : undefined;
  const inhibitors = options.handlers!.includes("inhibitors")
    ? `"./inhibitors"`
    : undefined;
  const buttons = options.handlers!.includes("buttons")
    ? `"./interactions/buttons"`
    : undefined;
  const selectMenus = options.handlers!.includes("selectmenus")
    ? `"./interactions/selectmenus"`
    : undefined;

  return [
    `{
  template: "${options.template}",
  handlers: {
    applicationCommands: ${applicationCommands},
    messageCommands: ${messageCommands},
    events: ${events},
    inhibitors: ${inhibitors},
    buttons: ${buttons},
    selectMenus: ${selectMenus},
  },
}
`,
    "cli-config.json",
  ];
};
