import { prisma } from "@/lib/db";
import MessagesClient from "./MessagesClient";

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof prisma.contactMessage.findMany>> = [];
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch { /* db not connected */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Contact form submissions from your portfolio
        </p>
      </div>
      <MessagesClient initialMessages={messages} />
    </div>
  );
}
