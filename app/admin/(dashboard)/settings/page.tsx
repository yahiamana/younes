import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import SocialLinksManager from "./SocialLinksManager";

export default async function AdminSettingsPage() {
  // NOTE: Auth is already enforced by the parent layout.tsx — no requireAuth() needed here.
  // Adding requireAuth() here caused 500 errors because it throws outside try/catch
  // during revalidation cycles.

  let settings = null;
  let socialLinks: any[] = [];

  try {
    const rawSettings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (rawSettings) {
      settings = {
        id: rawSettings.id,
        name: rawSettings.name || "",
        title: rawSettings.title || "",
        heroHeadline: rawSettings.heroHeadline || "",
        heroSubtext: rawSettings.heroSubtext || "",
        aboutText: rawSettings.aboutText || "",
        aboutHighlights: (rawSettings.aboutHighlights && rawSettings.aboutHighlights.trim() !== "") ? rawSettings.aboutHighlights : "{}",
        phone: rawSettings.phone || "",
        email: rawSettings.email || "",
        profilePhoto: rawSettings.profilePhoto ?? null,
        resumeUrl: rawSettings.resumeUrl ?? null,
        seoTitle: rawSettings.seoTitle || "",
        seoDescription: rawSettings.seoDescription || "",
        ogImage: rawSettings.ogImage ?? null,
      };
    }

    const rawSocial = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    socialLinks = rawSocial.map(sl => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
      icon: sl.icon ?? null,
      order: sl.order,
    }));
  } catch (err) {
    console.error("Admin Settings Fetch Error:", err);
  }

  // Deep-clean to guarantee pure JSON (no Prisma symbols, no Date objects)
  const safeSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
  const safeSocialLinks = JSON.parse(JSON.stringify(socialLinks));

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-white/40">
          Manage your site identity, profile, and SEO settings
        </p>
      </div>

      {safeSettings && <SettingsForm settings={safeSettings} />}
      <SocialLinksManager initialLinks={safeSocialLinks} />
    </div>
  );
}
