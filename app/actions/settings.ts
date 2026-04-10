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
    console.log("[DEBUG] updateSiteSettings triggered.");
    
    // Minimalist parsing to prevent logic crashes
    const data = {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      heroHeadline: formData.get("heroHeadline") as string,
      heroSubtext: formData.get("heroSubtext") as string,
      aboutText: formData.get("aboutText") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      profilePhoto: (formData.get("profilePhoto") as string) || null,
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
    };

    console.log("[DEBUG] Data extracted, starting DB operation...");

    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
      console.log("[DEBUG] Existing settings found. Updating ID:", existing.id);
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      console.log("[DEBUG] No settings found. Creating new record...");
      await prisma.siteSettings.create({ data });
    }

    console.log("[DEBUG] DB Operation Success.");
    return { success: true };
  } catch (error) {
    console.error("[CRITICAL DEBUG ERROR]:", error);
    const msg = error instanceof Error ? error.message : "Unknown Error";
    return { error: `Safe Mode Failed: ${msg}` };
  }
}
