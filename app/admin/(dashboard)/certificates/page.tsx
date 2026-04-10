import { prisma } from "@/lib/db";
import Link from "next/link";
import CertificateActions from "./CertificateActions";

export default async function AdminCertificatesPage() {
  let certificates: Awaited<ReturnType<typeof prisma.certificate.findMany>> = [];
  try {
    certificates = await prisma.certificate.findMany({
      orderBy: [{ order: "asc" }, { date: "desc" }],
    });
  } catch { /* db not connected */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your certificates and credentials
          </p>
        </div>
        <Link href="/admin/certificates/new" className="btn-primary text-sm">
          + New Certificate
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        {certificates.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{cert.title}</h3>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {cert.issuer} · {new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                </div>
                <CertificateActions certificateId={cert.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: "var(--text-tertiary)" }}>
            <p>No certificates yet. Add your first certificate!</p>
          </div>
        )}
      </div>
    </div>
  );
}
