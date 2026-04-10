"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { stripAllHtml, sanitizeHtml } from "@/lib/security/sanitize";
import { siteSettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const session = await requireAuth();

    // Securely extract and sanitize data
    const highlightsValue = formData.get("aboutHighlights") as string;
    
    // Validate JSON structure for highlights before saving
    try {
      if (highlightsValue) JSON.parse(highlightsValue);
    } catch {
      return { error: "aboutHighlights: Invalid JSON format" };
    }

    const raw = {
      name: stripAllHtml(formData.get("name") as string || ""),
      title: stripAllHtml(formData.get("title") as string || ""),
      heroHeadline: stripAllHtml(formData.get("heroHeadline") as string || ""),
      heroSubtext: stripAllHtml(formData.get("heroSubtext") as string || ""),
      aboutText: sanitizeHtml(formData.get("aboutText") as string || ""),
      aboutHighlights: highlightsValue, // DO NOT STRIP HTML/CHARS FROM JSON
      phone: stripAllHtml(formData.get("phone") as string || ""),
      email: stripAllHtml(formData.get("email") as string || ""),
      profilePhoto: (formData.get("profilePhoto") as string) || null,
      resumeUrl: (formData.get("resumeUrl") as string) || null,
      seoTitle: stripAllHtml(formData.get("seoTitle") as string || ""),
      seoDescription: stripAllHtml(formData.get("seoDescription") as string || ""),
      ogImage: (formData.get("ogImage") as string) || null,
    };

    const parsed = siteSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("[Settings Validation Error]:", fieldErrors);
      return { error: fieldErrors };
    }

    // Ensure we only have one record and it's the right one
    const allSettings = await prisma.siteSettings.findMany({ orderBy: { updatedAt: 'desc' } });
    
    if (allSettings.length > 0) {
      const primaryId = allSettings[0].id;
      await prisma.siteSettings.update({
        where: { id: primaryId },
        data: parsed.data,
      });

      // Cleanup extras if they somehow exist
      if (allSettings.length > 1) {
        await prisma.siteSettings.deleteMany({
          where: { id: { not: primaryId } }
        });
      }
      console.log("[Settings Action]: Updated primary record", primaryId);
    } else {
      const created = await prisma.siteSettings.create({ data: parsed.data });
      console.log("[Settings Action]: Created new record", created.id);
    }

    try {
      await logAudit(session.userId, "UPDATE_SETTINGS", "SiteSettings");
    } catch (e) {
      console.error("Non-blocking audit log failure:", e);
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    
    return { success: true };
  } catch (error) {
    console.error("[Settings Action Error]:", error);
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    return { error: `Save failed: ${msg}` };
  }
}
