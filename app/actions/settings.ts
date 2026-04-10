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

    // Restore Sanitization & Validation
    const raw = {
      name: stripAllHtml(formData.get("name") as string),
      title: stripAllHtml(formData.get("title") as string),
      heroHeadline: stripAllHtml(formData.get("heroHeadline") as string),
      heroSubtext: stripAllHtml(formData.get("heroSubtext") as string),
      aboutText: sanitizeHtml(formData.get("aboutText") as string),
      phone: stripAllHtml(formData.get("phone") as string),
      email: stripAllHtml(formData.get("email") as string),
      profilePhoto: (formData.get("profilePhoto") as string) || null,
      seoTitle: stripAllHtml(formData.get("seoTitle") as string),
      seoDescription: stripAllHtml(formData.get("seoDescription") as string),
    };

    const parsed = siteSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      await prisma.siteSettings.create({ data: parsed.data });
    }

    // Attempt Audit Log (non-blocking)
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
