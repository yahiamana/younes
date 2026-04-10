import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  // If the user lands on the login page, but they ALREADY have a valid database session:
  // Immediately shuttle them into the dashboard cleanly.
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  // Otherwise, render the secure login form.
  return <>{children}</>;
}
