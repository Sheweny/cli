/**
 * Get the version of the application with package.json
 */
export function getVersion(): string {
  return require("../../../package.json").version;
}
