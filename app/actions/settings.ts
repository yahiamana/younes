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

    // Heavy XSS sanitization since these render publicly on the frontend
    const raw = {
      name: stripAllHtml(formData.get("name") as string),
      title: stripAllHtml(formData.get("title") as string),
      heroHeadline: stripAllHtml(formData.get("heroHeadline") as string),
      heroSubtext: stripAllHtml(formData.get("heroSubtext") as string),
      aboutText: sanitizeHtml(formData.get("aboutText") as string),
      aboutHighlights: stripAllHtml(formData.get("aboutHighlights") as string || ""),
      phone: stripAllHtml(formData.get("phone") as string),
      email: stripAllHtml(formData.get("email") as string),
      profilePhoto: (formData.get("profilePhoto") as string) || null,
      resumeUrl: (formData.get("resumeUrl") as string) || null,
      seoTitle: stripAllHtml(formData.get("seoTitle") as string),
      seoDescription: stripAllHtml(formData.get("seoDescription") as string),
      ogImage: (formData.get("ogImage") as string) || null,
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

    await logAudit(session.userId, "UPDATE_SETTINGS", "SiteSettings");

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    // Diagnostic Recovery: Return the detailed error to the UI string to debug Vercel environment
    const errorDetail = error instanceof Error 
      ? `${error.name}: ${error.message} ${error.stack?.split('\n').slice(0, 2).join(' ')}` 
      : "Unknown Server Error";
    
    console.error("[CRITICAL DB ERROR]:", error);
    return { error: `Server Error (Code: 500): ${errorDetail}. Check Vercel logs for full trace.` };
  }
}
