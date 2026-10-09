import { redirect } from "next/navigation";

/** The 3D journey now lives inside the About page. */
export default function JourneyPage() {
  redirect("/about#journey");
}
