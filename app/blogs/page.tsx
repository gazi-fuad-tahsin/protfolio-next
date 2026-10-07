import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/ui/Cards";
import { Cover } from "@/components/ui/Cover";
import { Reveal } from "@/components/ui/Motion";
import { Chip } from "@/components/ui/Primitives";
import { formatDate, posts } from "@/lib/data";
import { L } from "@/components/ui/L";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Engineering notes on backend, payments, real-time systems, security, DevOps and leadership.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  const featured = posts.find((p) => p.mostViewed) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured.slug);

  return (
    <section className="container-page pt-36 pb-24">
      <Reveal>
        <h1 className="display text-[56px] font-bold sm:text-[80px] lg:text-[120px]">
          <L k="blog.heading">Engineering Notes</L>
        </h1>
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
          <L k="blog.intro">Practical write-ups from real projects — authentication, payments, real-time systems, databases, security and leading a team.</L>
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <Link href={`/blogs/${featured.slug}`} className="group mt-12 block">
          <div className="relative">
            <Cover
              cover={featured.cover}
              label={featured.title}
              priority
              className="aspect-[16/9] rounded-[20px] transition-transform duration-500 group-hover:scale-[0.99] md:aspect-[21/9]"
            />
            <span className="display absolute top-5 left-5 rounded-full bg-accent px-4 py-1.5 text-lg text-accent-fg">
              <L k="blog.mostViewed">Most Viewed</L>
            </span>
          </div>
          <div className="mt-5 flex items-center gap-3 text-xs text-muted">
            <Chip>{featured.category}</Chip>
            <span>{formatDate(featured.date)}</span>
            <span>· {featured.readTime}</span>
          </div>
          <h2 className="display mt-3 text-[32px] transition-colors group-hover:text-accent md:text-[40px]">{featured.title}</h2>
          <p className="mt-2 max-w-[720px] text-sm leading-relaxed text-muted">{featured.excerpt}</p>
        </Link>
      </Reveal>

      <div className="mt-20 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.1}>
            <PostCard post={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
