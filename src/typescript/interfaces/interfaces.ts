export interface IOptions {
  executeType: "create" | "add";
  dirName?: string;
  addType?: string;
  targetDirectory?: string;
  templateDirectory?: string;
  template?: "javascript" | "typescript";
  skipPrompts: boolean;
  packageManager?: "npm" | "yarn";
}
