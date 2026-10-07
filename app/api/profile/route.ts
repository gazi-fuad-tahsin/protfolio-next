import { json } from "@/lib/api";
import { profile, services } from "@/lib/data";

export function GET() {
  return json({
    name: profile.name,
    role: profile.role,
    location: profile.location,
    available: profile.available,
    experienceYears: profile.stats[0].value,
    services: services.map((s) => s.title),
    stack: [...new Set(services.flatMap((s) => s.stack))],
    links: { resume: profile.resume, email: profile.email },
  });
}
