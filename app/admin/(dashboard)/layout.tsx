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

  const settings = await prisma.siteSettings.findFirst();

  return (
    <AdminShell
      userName={settings?.name || "Admin"}
      userEmail={session.user.email}
      profilePhoto={settings?.profilePhoto || null}
    >
      {children}
    </AdminShell>
  );
}
