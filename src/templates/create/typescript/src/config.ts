import { ICreateOptions } from "../../../../typescript/interfaces/interfaces";

export = (options: ICreateOptions) => {
  const token = options.token ? options.token : "your_token";
  const file = options.configFileType;

  function typeConfig(): string {
    if (file === "json")
      return `{
  "DISCORD_TOKEN": "${token}"
}
`;
    else
      return `export = {
  DISCORD_TOKEN: "${token}",
};
`;
  }

  return [typeConfig(), `config.${file}`];
};
