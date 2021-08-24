export interface ICreateOptions {
  executeType?: "create";
  help: boolean;
  dirName?: string;
  targetDirectory?: string;
  templateDirectory?: string;
  template?: "javascript" | "typescript";
  skipPrompts?: boolean;
  packageManager?: "npm" | "yarn";
  token?: string;
  git?: boolean;
  commandType?: "MessageCommand" | "ApplicationCommand";
  handlers?: string[];
  configFileType?: "json" | "js" | "ts";
  optionnalLibrary?: string[];
}

export interface IAddOptions {
  executeType?: "add";
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
  applicationCommandType?: "CHAT_INPUT" | "USER" | "MESSAGE";
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
    applicationCommands: string | undefined;
    messageCommands: string | undefined;
    events: string | undefined;
    inhibitors: string | undefined;
    buttons: string | undefined;
    selectMenus: string | undefined;
  };
}
