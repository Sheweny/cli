export interface ICreateOptions {
  executeType: "create";
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
  executeType: "add";
  addType?: "command" | "event";
}
