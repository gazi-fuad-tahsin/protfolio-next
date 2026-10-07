import profileJson from "@/data/profile.json";
import servicesJson from "@/data/services.json";
import aboutJson from "@/data/about.json";
import projectsJson from "@/data/projects.json";
import blogsJson from "@/data/blogs.json";
import recognitionJson from "@/data/recognition.json";
import faqJson from "@/data/faq.json";

export type Cover = {
  image: string;
  from: string;
  to: string;
  pattern: "grid" | "orbit" | "wave" | "prism";
};

export type Project = {
  slug: string;
  featured: boolean;
  title: string;
  category: string;
  excerpt: string;
  year: string;
  type: string;
  role: string;
  duration: string;
  stack: string[];
  github: string;
  live: string;
  cover: Cover;
  problem: string[];
  solution: string[];
  challenge: string[];
  summary: string[];
};

export type PostSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
  callout?: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  intro: string;
  mostViewed: boolean;
  cover: Cover;
  sections: PostSection[];
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
};

export type Recognition = {
  heading: string;
  intro: string;
  testimonials: Testimonial[];
  highlights: { org: string; period: string; text: string }[];
  stats: { value: number; suffix: string; label: string; caption: string; tone: "ink" | "accent" }[];
};

export const profile = profileJson;
export const services = servicesJson.services;
export const learning = servicesJson.learning;
export const about = aboutJson;
export const projects = projectsJson as Project[];
export const posts = (blogsJson as Post[]).toSorted((a, b) => b.date.localeCompare(a.date));
export const recognition = recognitionJson as Recognition;
export const faq = faqJson;

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export { formatDate } from "./format";
