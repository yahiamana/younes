"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { socialLinkSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createSocialLink(formData: FormData) {
  try {
    const session = await requireAuth();

    const raw = {
      platform: formData.get("platform") as string,
      url: formData.get("url") as string,
      icon: (formData.get("icon") as string) || null,
      order: parseInt(formData.get("order") as string) || 0,
    };

    const parsed = socialLinkSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[Social Action Validation Error]:", parsed.error.flatten().fieldErrors);
      return { error: parsed.error.flatten().fieldErrors };
    }

    const created = await prisma.socialLink.create({ data: parsed.data });
    console.log("[Social Action]: Created link", created.id);

    try {
      await logAudit(session.userId, "CREATE_SOCIALLINK", "SocialLink", created.platform);
    } catch (e) {
      console.error("Non-blocking audit failure:", e);
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/settings");
    } catch (e) {
      console.error("Non-blocking revalidation failure:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("[Social Create Error]:", error);
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    return { error: `Add link failed: ${msg}` };
  }
}

export async function updateSocialLink(id: string, formData: FormData) {
  try {
    const session = await requireAuth();

    const raw = {
      platform: formData.get("platform") as string,
      url: formData.get("url") as string,
      icon: (formData.get("icon") as string) || null,
      order: parseInt(formData.get("order") as string) || 0,
    };

    const parsed = socialLinkSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    await prisma.socialLink.update({ where: { id }, data: parsed.data });

    try {
      await logAudit(session.userId, "UPDATE_SOCIALLINK", "SocialLink", id);
    } catch (e) {
      console.error("Non-blocking audit failure:", e);
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/settings");
    } catch (e) {
      console.error("Non-blocking revalidation failure:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("[Social Update Error]:", error);
    const msg = error instanceof Error ? error.message : "Update failed";
    return { error: msg };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const session = await requireAuth();

    await prisma.socialLink.delete({ where: { id } });

    try {
      await logAudit(session.userId, "DELETE_SOCIALLINK", "SocialLink", id);
    } catch (e) {
      console.error("Non-blocking audit failure:", e);
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/settings");
    } catch (e) {
      console.error("Non-blocking revalidation failure:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("[Social Delete Error]:", error);
    return { error: "Delete failed" };
  }
}
