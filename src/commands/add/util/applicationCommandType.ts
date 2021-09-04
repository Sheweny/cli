export function applicationCommandType(
  type: string
): "CHAT_INPUT" | "USER" | "MESSAGE" | undefined {
  if (type === "Slash Command") return "CHAT_INPUT";
  if (type === "Context Menu User") return "USER";
  if (type === "Context Menu Message") return "MESSAGE";
  return undefined;
}
