import { prisma } from "@/lib/db";
import Link from "next/link";

async function getStats() {
  try {
    const [projectCount, certCount, messageCount, unreadCount] = await Promise.all([
      prisma.project.count(),
      prisma.certificate.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return { projectCount, certCount, messageCount, unreadCount, recentMessages };
  } catch {
    return { projectCount: 0, certCount: 0, messageCount: 0, unreadCount: 0, recentMessages: [] };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Projects", value: stats.projectCount, href: "/admin/projects", color: "#6366f1" },
    { label: "Certificates", value: stats.certCount, href: "/admin/certificates", color: "#8b5cf6" },
    { label: "Messages", value: stats.messageCount, href: "/admin/messages", color: "#06b6d4" },
    { label: "Unread", value: stats.unreadCount, href: "/admin/messages", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Welcome back. Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-card hover:border-[var(--border-medium)] transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {card.label}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}15`, color: card.color }}
              >
                <span className="text-sm font-bold">{card.value}</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Recent Messages</h2>
          <Link
            href="/admin/messages"
            className="text-sm font-medium"
            style={{ color: "var(--accent-primary)" }}
          >
            View all →
          </Link>
        </div>

        {stats.recentMessages.length > 0 ? (
          <div className="space-y-3">
            {stats.recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-4 p-4 rounded-lg transition-colors"
                style={{
                  background: msg.read ? "transparent" : "var(--accent-glow)",
                  border: `1px solid ${msg.read ? "var(--border-subtle)" : "rgba(99,102,241,0.1)"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: "var(--bg-secondary)", color: "var(--accent-primary)" }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{msg.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                    {msg.subject}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                    {msg.message.slice(0, 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-tertiary)" }}>
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
