import { ICreateOptions } from "../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  const applicationCommands =
    options.handlers!.includes("commands") && options.commandType === "ApplicationCommand"
      ? `"src/commands"`
      : null;
  const messageCommands =
    options.handlers!.includes("commands") && options.commandType === "MessageCommand"
      ? `"src/commands"`
      : null;
  const events = options.handlers!.includes("events") ? `"src/events"` : null;
  const inhibitors = options.handlers!.includes("inhibitors")
    ? `"src/inhibitors"`
    : null;
  const buttons = options.handlers!.includes("buttons")
    ? `"src/interactions/buttons"`
    : null;
  const selectMenus = options.handlers!.includes("selectmenus")
    ? `"src/interactions/selectmenus"`
    : null;

  return [
    `{
  "template": "${options.template}",
  "handlers": {
    "applicationCommands": ${applicationCommands},
    "messageCommands": ${messageCommands},
    "events": ${events},
    "inhibitors": ${inhibitors},
    "buttons": ${buttons},
    "selectMenus": ${selectMenus}
  }
}
`,
    "cli-config.json",
  ];
};
