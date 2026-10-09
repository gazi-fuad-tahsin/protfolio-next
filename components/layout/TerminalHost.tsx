import { getTerminalData } from "@/lib/terminal-data";
import { TerminalModal } from "./TerminalModal";

/** Mounted once in the layout; the modal opens from the navbar button or Ctrl+`. */
export function TerminalHost() {
  return <TerminalModal data={getTerminalData()} />;
}
