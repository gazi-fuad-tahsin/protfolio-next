import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { getTerminalData } from "@/lib/terminal-data";
import { TerminalClient } from "./TerminalClient";

export function AboutTerminal() {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading
          i18n="terminal"
          title="Explore in the terminal"
          intro="Prefer the command line? Type a command — or tap one below — to get to know me the developer way."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <TerminalClient data={getTerminalData()} />
      </Reveal>
    </section>
  );
}
