import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { highlight } from "sugar-high";
import { CodeBlock, ReadingProgress, TableOfContents } from "@/components/blog/BlogTools";
import { Newsletter } from "@/components/sections/Newsletter";
import { PostCard } from "@/components/ui/Cards";
import { Cover } from "@/components/ui/Cover";
import { Reveal } from "@/components/ui/Motion";
import { Chip } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";
import { formatDate, getPost, posts, profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        alternates: { canonical: `/blogs/${slug}` },
        openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
      }
    : {};
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default async function PostPage(props: PageProps<"/blogs/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const toc = post.sections.map((s) => ({ id: slugify(s.heading), label: s.heading }));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blogs/${post.slug}`,
    image: `${siteUrl}/blogs/${post.slug}/opengraph-image`,
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <article className="mx-auto max-w-[1160px] px-4 pt-36 md:px-10">
        <Reveal className="max-w-[880px]">
          <h1 className="display text-[44px] font-bold sm:text-[64px] lg:text-[88px]">{post.title}</h1>
          <p className="mt-4 max-w-[720px] text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted">
            <Chip>{post.category}</Chip>
            <span>{formatDate(post.date)}</span>
            <span>· {post.readTime}</span>
          </div>
          <div className="lang-bn">
            <p className="mt-4 inline-block rounded-full bg-surface px-3 py-1 text-xs text-muted">
              <L k="blog.englishNote">This article is in English.</L>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Cover cover={post.cover} label={post.title} priority className="mt-12 aspect-[16/9] rounded-[20px]" />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            {/* mobile table of contents */}
            <details className="mb-10 rounded-2xl border border-line p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">
                <L k="blog.onThisPage">On this page</L>
              </summary>
              <ol className="mt-3 space-y-2 text-sm text-muted">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="hover:text-fg">
                      {i + 1}. {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <p className="border-l-4 border-accent pl-5 text-lg leading-relaxed md:text-xl">{post.intro}</p>

            <div className="prose-post mt-14 space-y-12">
              {post.sections.map((s, i) => (
                <section key={s.heading} id={toc[i].id} className="scroll-mt-28">
                  <h2 className="display text-[26px] md:text-[32px]">
                    {i + 1}. {s.heading}
                  </h2>
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {s.code && <CodeBlock code={s.code} html={highlight(s.code)} />}
                  {s.callout && (
                    <div className="mt-5 flex gap-3 rounded-2xl bg-accent/10 p-5 text-[15px] leading-relaxed">
                      <span className="display shrink-0 text-accent">Tip</span>
                      <span>{s.callout}</span>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>

        <div className="max-w-[880px]">
          <Newsletter />
        </div>
      </article>

      <section className="container-page py-24 md:py-32">
        <Reveal>
          <h2 className="display text-[42px] font-bold md:text-[56px]">
            <L k="blog.more">More to Discover</L>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {more.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
