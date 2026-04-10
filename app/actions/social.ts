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

  await prisma.socialLink.create({ data: parsed.data });
  await logAudit(session.userId, "CREATE_SOCIALLINK", "SocialLink", parsed.data.platform);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateSocialLink(id: string, formData: FormData) {
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
  await logAudit(session.userId, "UPDATE_SOCIALLINK", "SocialLink", id);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  const session = await requireAuth();

  await prisma.socialLink.delete({ where: { id } });
  await logAudit(session.userId, "DELETE_SOCIALLINK", "SocialLink", id);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
