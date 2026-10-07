import Link from "next/link";
import { Cover } from "./Cover";
import { Chip } from "./Primitives";
import { ArrowUpRight } from "./Icons";
import type { Post, Project } from "@/lib/data";
import { formatDate } from "@/lib/format";

function HoverArrow() {
  return (
    <span className="absolute top-4 right-4 flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-accent text-accent-fg opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 -rotate-45">
      <ArrowUpRight className="h-6 w-6" />
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative">
        <Cover
          cover={project.cover}
          label={project.title}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] rounded-[20px] transition-transform duration-500 group-hover:scale-[0.98]"
        />
        <HoverArrow />
      </div>
      <div className="mt-4">
        <Chip>{project.category}</Chip>
      </div>
      <h3 className="display mt-3 text-[26px] transition-colors group-hover:text-accent">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.excerpt}</p>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <div className="relative">
        <Cover
          cover={post.cover}
          label={post.title}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] rounded-[20px] transition-transform duration-500 group-hover:scale-[0.98]"
        />
        <HoverArrow />
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <Chip>{post.category}</Chip>
        <span>{formatDate(post.date)}</span>
        <span>· {post.readTime}</span>
      </div>
      <h3 className="display mt-3 text-[26px] transition-colors group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
    </Link>
  );
}
