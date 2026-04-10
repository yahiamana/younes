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

    console.log("[Settings Action] Validation success. Starting DB operation...");

    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
      console.log("[Settings Action] Database UPDATE successful.");
    } else {
      await prisma.siteSettings.create({ data: parsed.data });
      console.log("[Settings Action] Database CREATE successful.");
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    
    console.log("[Settings Action] Revalidation complete. Returning success.");
    return { success: true };
  } catch (error) {
    const errorDetail = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : "Unknown Server Error";
    
    console.error("[Settings Action CRITICAL ERROR]:", error);
    return { error: `Server Error: ${errorDetail}` };
  }
}
