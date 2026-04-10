"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { stripAllHtml } from "@/lib/security/sanitize";
import { logAudit } from "@/lib/security/audit";
import { sendContactEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type ContactState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
} | null;

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Get IP for rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";

  const rl = await rateLimit(ip, "contact");
  if (!rl.success) {
    return {
      error: `Too many messages. Please try again in ${Math.ceil(rl.retryAfter! / 60)} minutes.`,
    };
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Sanitize inputs
  // Sanitize heavily against XSS
  const sanitized = {
    name: stripAllHtml(parsed.data.name),
    email: parsed.data.email, // already validated by Zod
    subject: stripAllHtml(parsed.data.subject),
    message: stripAllHtml(parsed.data.message),
  };

  try {
    // Store in database
    await prisma.contactMessage.create({ data: sanitized });

    // Send email notification (non-blocking)
    sendContactEmail(sanitized).catch(console.error);

    return { success: true };
  } catch {
    return { error: "Failed to send message. Please try again later." };
  }
}

export async function getMessages() {
  const session = await requireAuth();

  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageRead(id: string) {
  const session = await requireAuth();

  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  await logAudit(session.userId, "READ_MESSAGE", "ContactMessage", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await requireAuth();

  await prisma.contactMessage.delete({ where: { id } });
  await logAudit(session.userId, "DELETE_MESSAGE", "ContactMessage", id);
  revalidatePath("/admin/messages");
  return { success: true };
}
