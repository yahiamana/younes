"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { skillSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}

export async function createSkill(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    icon: (formData.get("icon") as string) || null,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.skill.create({ data: parsed.data });
  await logAudit(session.userId, "CREATE_SKILL", "Skill", parsed.data.name);
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function updateSkill(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    icon: (formData.get("icon") as string) || null,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.skill.update({ where: { id }, data: parsed.data });
  await logAudit(session.userId, "UPDATE_SKILL", "Skill", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function deleteSkill(id: string) {
  const session = await requireAuth();

  await prisma.skill.delete({ where: { id } });
  await logAudit(session.userId, "DELETE_SKILL", "Skill", id);
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}
