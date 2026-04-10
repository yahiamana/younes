import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import SocialLinksManager from "./SocialLinksManager";

export default async function AdminSettingsPage() {
  let settings = null;
  let socialLinks: Awaited<ReturnType<typeof prisma.socialLink.findMany>> = [];

  try {
    settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    socialLinks = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch { /* db not connected */ }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage your site identity, profile, and SEO settings
        </p>
      </div>

      {settings && <SettingsForm settings={settings} />}
      <SocialLinksManager initialLinks={socialLinks} />
    </div>
  );
}
