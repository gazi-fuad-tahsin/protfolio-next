import { PostCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Motion";
import { PillLink, SectionHeading } from "@/components/ui/Primitives";
import { posts } from "@/lib/data";
import { L } from "@/components/ui/L";

export function BlogPreview() {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading
          i18n="blog"
          title="Engineering Notes"
          intro="Practical write-ups from real projects — authentication, payments, real-time systems, databases, security and leading a team."
        />
      </Reveal>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-6">
        {posts.slice(0, 2).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1}>
            <PostCard post={p} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <PillLink href="/blogs">
          <L k="blog.browse">Browse All Articles</L>
        </PillLink>
      </div>
    </section>
  );
}
