import { Accordion, Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { faq } from "@/lib/data";
import { L } from "@/components/ui/L";

export function Faq() {
  return (
    <section className="container-page grid gap-10 py-24 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-32">
      <Reveal>
        <div className="md:sticky md:top-28">
          <SectionHeading
            i18n="faq"
            title="Frequently Asked Questions"
            intro="Answers to the questions I hear most from clients and recruiters. Don't see yours? Reach out — I'm happy to help."
          />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <Accordion titleClassName="text-[20px] md:text-[22px]" items={faq.map((f, i) => ({ title: <L k={`faq.${i}.q`}>{f.q}</L>, content: <L k={`faq.${i}.a`}>{f.a}</L> }))} />
      </Reveal>
    </section>
  );
}
