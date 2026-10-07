import {
  siC,
  siCloudflare,
  siCloudinary,
  siCodechef,
  siCodeforces,
  siCplusplus,
  siDart,
  siDocker,
  siExpress,
  siFigma,
  siGoogleanalytics,
  siJira,
  siMiro,
  siNotion,
  siVercel,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siJavascript,
  siJsonwebtokens,
  siKubernetes,
  siLinux,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siPostman,
  siPython,
  siReact,
  siReactquery,
  siResend,
  siRevenuecat,
  siSocketdotio,
  siStripe,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

/** Keys usable from data/*.json (e.g. "icons": ["nodedotjs", "express"]). */
export const logos: Record<string, SimpleIcon> = {
  c: siC,
  cloudflare: siCloudflare,
  cloudinary: siCloudinary,
  codechef: siCodechef,
  codeforces: siCodeforces,
  cplusplus: siCplusplus,
  dart: siDart,
  docker: siDocker,
  express: siExpress,
  figma: siFigma,
  googleanalytics: siGoogleanalytics,
  jira: siJira,
  miro: siMiro,
  notion: siNotion,
  vercel: siVercel,
  firebase: siFirebase,
  flutter: siFlutter,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  javascript: siJavascript,
  jwt: siJsonwebtokens,
  kubernetes: siKubernetes,
  linux: siLinux,
  mongodb: siMongodb,
  mysql: siMysql,
  nextdotjs: siNextdotjs,
  nginx: siNginx,
  nodedotjs: siNodedotjs,
  java: siOpenjdk,
  php: siPhp,
  postman: siPostman,
  python: siPython,
  react: siReact,
  reactquery: siReactquery,
  resend: siResend,
  revenuecat: siRevenuecat,
  socketdotio: siSocketdotio,
  stripe: siStripe,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
};

/** Brand logo. Near-black brand colours fall back to currentColor so they work in dark mode. */
export function TechLogo({ name, className = "h-6 w-6", mono = false }: { name: string; className?: string; mono?: boolean }) {
  const icon = logos[name];
  if (!icon) return null;
  const dark = parseInt(icon.hex, 16) < 0x333333;
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={icon.title} fill={mono || dark ? "currentColor" : `#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}

export function logoTitle(name: string) {
  return logos[name]?.title ?? name;
}
