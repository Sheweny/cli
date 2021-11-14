export interface ICommand {
  commandName?: "create" | "add" | "help";
  arguments: string[];
  skipPrompts: boolean;
}
export interface ICreateOptions {
  dirName?: string;
  targetDirectory?: string;
  templateDirectory?: string;
  template?: "javascript" | "typescript";
  packageManager?: "npm" | "yarn";
  token?: string;
  git?: boolean;
  handlers?: string[];
  configFileType?: "json" | "js" | "ts";
  optionnalLibrary?: string[];
  version?: number;
}
export type AddType = "command" | "event" | "button" | "selectmenu" | "inhibitor";
export interface IAddOptions {
  addType?: AddType;
  addName?: string;
  eventOptions?: eventOptions;
  commandOptions?: commandOptions;
  templateDirectory?: string;
  config?: ICliConfig;
  target?: string;
  inhibitorsTypes?: string[];
}

interface commandOptions {
  type?: "SLASH_COMMAND" | "CONTEXT_MENU_USER" | "CONTEXT_MENU_MESSAGE" | "MESSAGE_COMMAND";
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
  };
}
