import Link from "next/link";
import { L } from "@/components/ui/L";
import { PillLink } from "@/components/ui/Primitives";

export const metadata = { title: "Page not found" };

const paper = {
  backgroundColor: "#f7f2e8",
  backgroundImage:
    "linear-gradient(90deg, transparent 38px, rgba(224,86,122,0.35) 38px, rgba(224,86,122,0.35) 39px, transparent 39px), repeating-linear-gradient(transparent 0 27px, rgba(83,89,210,0.18) 27px 28px)",
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[100svh] items-center justify-center pt-28 pb-16">
      <div className="relative w-full max-w-[520px]">
        {/* torn diary page */}
        <div
          className="relative -rotate-2 rounded-[6px] px-12 pt-10 pb-16 text-[#2b2a33] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.35)]"
          style={{ ...paper, clipPath: "polygon(0 0,100% 0,100% 92%,94% 96%,88% 92%,80% 97%,72% 93%,63% 98%,55% 93%,46% 97%,38% 92%,29% 97%,20% 93%,11% 98%,4% 93%,0 96%)" }}
        >
          <div className="absolute top-4 right-5 h-5 w-14 rotate-[6deg] bg-[#f6e7b6]/90" />
          <p className="hand text-xl text-black/60">page</p>
          <p className="display text-[120px] leading-none font-bold text-[#5359d2]">404</p>
          <p className="hand mt-2 text-[30px] leading-tight">
            <L k="notFound.title">This page isn&apos;t in my diary</L>
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-black/70">
            <L k="notFound.text">Looks like this page was torn out. Let&apos;s get you back on track.</L>
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <PillLink href="/">
            <L k="notFound.home">Back home</L>
          </PillLink>
          <Link href="/projects" className="display rounded-full px-6 py-2 text-lg text-muted hover:text-fg">
            <L k="nav.projects">Projects</L>
          </Link>
          <Link href="/blogs" className="display rounded-full px-6 py-2 text-lg text-muted hover:text-fg">
            <L k="nav.blogs">Blogs</L>
          </Link>
        </div>
      </div>
    </section>
  );
}
