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
    { label: "Projects", value: stats.projectCount, href: "/admin/projects", color: "#e8c97e" },
    { label: "Certificates", value: stats.certCount, href: "/admin/certificates", color: "#e8c97e" },
    { label: "Messages", value: stats.messageCount, href: "/admin/messages", color: "#e8c97e" },
    { label: "Unread", value: stats.unreadCount, href: "/admin/messages", color: "#e8c97e" },
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
            className="admin-card hover:border-[#e8c97e]/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {card.label}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#e8c97e] group-hover:text-[#0e0e1c]"
                style={{ background: "rgba(232, 201, 126, 0.05)", color: "#e8c97e", border: "1px solid rgba(232, 201, 126, 0.15)" }}
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
            className="text-sm font-bold hover:text-[#e8c97e] transition-colors"
            style={{ color: "var(--accent-primary)" }}
          >
            View all →
          </Link>
        </div>

        {stats.recentMessages.length > 0 ? (
          <div className="space-y-4">
            {stats.recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 group"
                style={{
                  background: msg.read ? "transparent" : "rgba(232, 201, 126, 0.03)",
                  border: `1px solid ${msg.read ? "rgba(255,255,255,0.05)" : "rgba(232, 201, 126, 0.1)"}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border border-white/5"
                  style={{ background: "var(--bg-secondary)", color: msg.read ? "var(--text-secondary)" : "#e8c97e" }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-bold text-sm truncate ${msg.read ? 'text-white' : 'text-[#e8c97e]'}`}>{msg.name}</span>
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
