import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminShell from "./components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  // Extract ONLY plain strings for the client component — no Prisma objects or Dates
  let userName = "Admin";
  let userEmail = session.user?.email || "";
  let profilePhoto: string | null = null;

  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) {
      userName = settings.name || "Admin";
      profilePhoto = settings.profilePhoto || null;
    }
  } catch (err) {
    console.error("Admin Layout: Failed to fetch settings:", err);
  }

  return (
    <AdminShell
      userName={userName}
      userEmail={userEmail}
      profilePhoto={profilePhoto}
    >
      {children}
    </AdminShell>
  );
}
