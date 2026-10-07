import type { Metadata } from "next";
import { Antonio, Caveat, Hind_Siliguri, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollBackground } from "@/components/layout/ScrollBackground";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { langScript, themeScript } from "@/lib/boot-scripts";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const antonio = Antonio({ variable: "--font-antonio", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-hand", subsets: ["latin"], preload: false });
// Only downloaded when Bangla text is actually on screen (unicode-range), so English visitors don't pay for it.
const hind = Hind_Siliguri({ variable: "--font-bn", subsets: ["bengali"], weight: ["400", "600", "700"], preload: false });

const title = `${profile.name} — Full Stack Developer & Team Leader`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.shortName}` },
  description: profile.aboutShort,
  alternates: { canonical: "/" },
  openGraph: { title, description: profile.aboutShort, type: "website", url: "/", siteName: profile.name },
  twitter: { card: "summary_large_image", title, description: profile.aboutShort },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Team Leader, Mobile App Development · Full Stack Developer",
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "RP Shaha University" },
  worksFor: { "@type": "Organization", name: "ScaleUp Ads Agency" },
  knowsAbout: ["Node.js", "TypeScript", "REST APIs", "MongoDB", "Next.js", "React", "Flutter", "Stripe", "Socket.io"],
  sameAs: profile.socials.map((s) => s.url).filter((u) => !u.includes("your-handle")),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${antonio.variable} ${caveat.variable} ${hind.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + langScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body className="min-h-screen">
        <ScrollBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
