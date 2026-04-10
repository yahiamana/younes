import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import SocialLinksManager from "./SocialLinksManager";

export default async function AdminSettingsPage() {
  let settings = null;
  let socialLinks: Awaited<ReturnType<typeof prisma.socialLink.findMany>> = [];

  try {
    const rawSettings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    
    // Explicitly pick fields to ensure POJO serialization
    if (rawSettings) {
      settings = {
        id: rawSettings.id,
        name: rawSettings.name || "",
        title: rawSettings.title || "",
        heroHeadline: rawSettings.heroHeadline || "",
        heroSubtext: rawSettings.heroSubtext || "",
        aboutText: rawSettings.aboutText || "",
        aboutHighlights: rawSettings.aboutHighlights || "{}",
        phone: rawSettings.phone || "",
        email: rawSettings.email || "",
        profilePhoto: rawSettings.profilePhoto,
        resumeUrl: rawSettings.resumeUrl,
        seoTitle: rawSettings.seoTitle || "",
        seoDescription: rawSettings.seoDescription || "",
        ogImage: rawSettings.ogImage,
      };
    }

    const rawSocial = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    socialLinks = rawSocial.map(sl => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
      icon: sl.icon,
      order: sl.order,
    }));
  } catch (err) {
    console.error("Admin Settings Fetch Error:", err);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-white/40">
          Manage your site identity, profile, and SEO settings
        </p>
      </div>

      {settings && <SettingsForm settings={settings} />}
      <SocialLinksManager initialLinks={socialLinks} />
    </div>
  );
}
