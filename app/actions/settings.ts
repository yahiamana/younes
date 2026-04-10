"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { siteSettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

/**
 * Safe string sanitizer that works on any platform (no DOM dependency).
 * Strips HTML tags using a regex — sufficient for plain text fields.
 */
function safeStripHtml(input: string): string {
  if (!input) return input;
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const session = await requireAuth();

    // Securely extract and sanitize data
    const highlightsValue = (formData.get("aboutHighlights") as string) || "{}";

    // Validate JSON structure for highlights before saving
    try {
      if (highlightsValue && highlightsValue.trim() !== "") JSON.parse(highlightsValue);
    } catch {
      return { error: "aboutHighlights: Invalid JSON format" };
    }

    const raw = {
      name: safeStripHtml((formData.get("name") as string) || ""),
      title: safeStripHtml((formData.get("title") as string) || ""),
      heroHeadline: safeStripHtml((formData.get("heroHeadline") as string) || ""),
      heroSubtext: safeStripHtml((formData.get("heroSubtext") as string) || ""),
      aboutText: (formData.get("aboutText") as string) || "",
      aboutHighlights: highlightsValue,
      phone: safeStripHtml((formData.get("phone") as string) || ""),
      email: safeStripHtml((formData.get("email") as string) || ""),
      profilePhoto: (formData.get("profilePhoto") as string) || null,
      resumeUrl: (formData.get("resumeUrl") as string) || null,
      seoTitle: safeStripHtml((formData.get("seoTitle") as string) || ""),
      seoDescription: safeStripHtml((formData.get("seoDescription") as string) || ""),
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

    try {
      revalidatePath("/");
      revalidatePath("/admin/settings");
    } catch (e) {
      console.error("Non-blocking revalidation failure:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("[Settings Action Error]:", error);
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    return { error: `Save failed: ${msg}` };
  }
}
