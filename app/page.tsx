import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { HowIWork } from "@/components/sections/HowIWork";
import { ApiPlayground } from "@/components/sections/ApiPlayground";
import { ProjectStack } from "@/components/sections/ProjectStack";
import { Recognition } from "@/components/sections/Recognition";
import { Faq } from "@/components/sections/Faq";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Contact } from "@/components/sections/Contact";
import { Reveal } from "@/components/ui/Motion";
import { PillLink, SectionHeading } from "@/components/ui/Primitives";
import { featuredProjects } from "@/lib/data";
import { L } from "@/components/ui/L";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AboutIntro />

      <section className="container-page pt-24 md:pt-32">
        <Reveal>
          <SectionHeading
            i18n="featured"
            title="Featured Projects"
            intro="Selected work across products and client platforms — secure APIs, real-time systems, payments and full stack apps built for production."
          />
        </Reveal>
        <ProjectStack projects={featuredProjects.map((p) => ({ ...p, problem: [], solution: [], challenge: [], summary: [] }))} />
        <div className="flex justify-center pt-16 pb-8">
          <PillLink href="/projects">
            <L k="featured.browse">Browse All Projects</L>
          </PillLink>
        </div>
      </section>

      <HowIWork />
      <Recognition />
      <ApiPlayground />
      <Faq />
      <BlogPreview />
      <Contact />
    </>
  );
}
