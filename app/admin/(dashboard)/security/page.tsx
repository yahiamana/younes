import { getAuditLogs, getSecurityEvents, getActiveSessions } from "@/app/actions/security";
import { RevokeSessionButton } from "./RevokeSessionButton";

export default async function SecurityDashboard() {
  const [logs, events, sessions] = await Promise.all([
    getAuditLogs(),
    getSecurityEvents(),
    getActiveSessions()
  ]);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }} className="mt-2 text-sm">
          Monitor active sessions, audit trails, and system-level security events. Defense in Depth.
        </p>
      </header>

      {/* Active Sessions */}
      <section className="admin-card">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Active Sessions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase" style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
              <tr>
                <th className="px-4 py-3">Device & Browser</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-4 py-3 font-medium text-white">{s.deviceInfo || 'Unknown Device'}</td>
                  <td className="px-4 py-3 font-mono">{s.ipAddress}</td>
                  <td className="px-4 py-3">{s.lastActive.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <RevokeSessionButton sessionId={s.id} />
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No active sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Threat Activity */}
      <section className="admin-card">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Threat Activity & Events
        </h2>
        <div className="overflow-x-auto max-h-[400px] relative">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase sticky top-0" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
              <tr>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">IP / Focus</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${e.severity === 'HIGH' || e.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{e.type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{e.ipAddress}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{e.createdAt.toLocaleString()}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No threat events recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit Logs */}
      <section className="admin-card">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#e8c97e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Audit Logs
        </h2>
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase sticky top-0" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Resource Target</th>
                <th className="px-4 py-3">IP Action</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-4 py-3 font-medium text-white">{l.action}</td>
                  <td className="px-4 py-3">
                    {l.targetResource} {l.targetId && <span className="opacity-50 break-all">({l.targetId})</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{l.ipAddress}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{l.createdAt.toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No audit logs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
