"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/security/audit";
import { certificateSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getCertificates() {
  return prisma.certificate.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

export async function getCertificate(id: string) {
  return prisma.certificate.findUnique({ where: { id } });
}

export async function createCertificate(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    date: formData.get("date") as string,
    imageUrl: (formData.get("imageUrl") as string) || null,
    fileUrl: (formData.get("fileUrl") as string) || null,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = certificateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.certificate.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });
  await logAudit(session.userId, "CREATE_CERTIFICATE", "Certificate", parsed.data.title);
  revalidatePath("/");
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function updateCertificate(id: string, formData: FormData) {
  const session = await requireAuth();

  const raw = {
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    date: formData.get("date") as string,
    imageUrl: (formData.get("imageUrl") as string) || null,
    fileUrl: (formData.get("fileUrl") as string) || null,
    order: parseInt(formData.get("order") as string) || 0,
  };

  const parsed = certificateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.certificate.update({
    where: { id },
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });
  await logAudit(session.userId, "UPDATE_CERTIFICATE", "Certificate", id);
  revalidatePath("/");
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function deleteCertificate(id: string) {
  const session = await requireAuth();

  await prisma.certificate.delete({ where: { id } });
  await logAudit(session.userId, "DELETE_CERTIFICATE", "Certificate", id);
  revalidatePath("/");
  revalidatePath("/admin/certificates");
  return { success: true };
}
