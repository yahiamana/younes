"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    techStack: (formData.get("techStack") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    image: (formData.get("image") as string) || null,
    liveUrl: (formData.get("liveUrl") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.project.create({ data: parsed.data });
  await logAudit(session.userId, "CREATE_PROJECT", "Project", parsed.data.slug);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    techStack: (formData.get("techStack") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    image: (formData.get("image") as string) || null,
    liveUrl: (formData.get("liveUrl") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.project.update({ where: { id }, data: parsed.data });
  await logAudit(session.userId, "UPDATE_PROJECT", "Project", id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const session = await requireAuth();

  await prisma.project.delete({ where: { id } });
  await logAudit(session.userId, "DELETE_PROJECT", "Project", id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}
