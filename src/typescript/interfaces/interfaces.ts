export interface ICommand {
  commandName?: "create" | "add" | "help";
  arguments: string[];
  skipPrompts: boolean;
}
export interface ICreateOptions {
  commandName?: "create";
  dirName?: string;
  targetDirectory?: string;
  templateDirectory?: string;
  template?: "javascript" | "typescript";
  skipPrompts?: boolean;
  packageManager?: "npm" | "yarn";
  token?: string;
  git?: boolean;
  handlers?: string[];
  configFileType?: "json" | "js" | "ts";
  optionnalLibrary?: string[];
  version?: number;
}

export interface IAddOptions {
  commandName?: "add";
  help: boolean;
  skipPrompts?: boolean;
  addType?: "command" | "event" | "button" | "selectmenu" | "inhibitor";
  addName?: string;
  commandType?: "MessageCommand" | "ApplicationCommand";
  eventOptions?: eventOptions;
  commandOptions?: commandOptions;
  templateDirectory?: string;
  config?: ICliConfig;
  target?: string;
  inhibitorsTypes?: string[];
}

interface commandOptions {
  applicationCommandType?: "SLASH_COMMAND" | "CONTEXT_MENU_USER" | "CONTEXT_MENU_MESSAGE" | "MESSAGE_COMMAND";
  description?: string;
  category?: string;
  only?: "DM" | "GUILD";
  cooldown?: number;
}

interface eventOptions {
  description?: string;
  once?: boolean;
}

export interface ICliConfig {
  template: "javascript" | "typescript";
  handlers: {
    commands: string | undefined;
    events: string | undefined;
    inhibitors: string | undefined;
    buttons: string | undefined;
    selectMenus: string | undefined;

    // Old version support :
    messageCommands: string | undefined;
    applicationCommands: string | undefined;
  };
}
