"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Link that scrolls back to the top when it points at the page you're
 * already on (Next.js doesn't navigate — or scroll — for same-URL links).
 */
export function NavLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    const target = typeof href === "string" ? href : (href.pathname ?? "");
    if (!target.includes("#") && target === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
