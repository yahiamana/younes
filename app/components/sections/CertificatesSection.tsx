"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: Date | string;
  imageUrl: string | null;
  fileUrl: string | null;
}

interface CertificatesProps {
  certificates: Certificate[];
}

export default function CertificatesSection({
  certificates,
}: CertificatesProps) {
  return (
    <section
      id="certificates"
      className="section-padding relative"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-custom relative z-10">
        <SectionHeading
          label="Credentials"
          title="Certificates & Achievements"
          description="Recognized qualifications and continuous learning milestones."
        />

        {certificates.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-12 md:p-24 border border-white/5 bg-white/[0.02] rounded-3xl relative overflow-hidden">
            <h3 className="text-2xl md:text-3xl font-light text-white/40 mb-4 tracking-widest text-center">
              NO CREDENTIALS YET
            </h3>
            <p className="text-white/20 uppercase tracking-[0.5em] text-xs text-center">
              Awaiting Updates
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <ScrollReveal key={cert.id} delay={i * 0.08}>
                <motion.div
                  className="card-premium p-6 h-full flex flex-col group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Certificate Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "var(--accent-glow)",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">
                        {cert.title}
                      </h3>
                      <p
                        className="text-sm truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {new Date(cert.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                        style={{
                          color: "var(--accent-primary)",
                          background: "var(--accent-glow)",
                        }}
                      >
                        View →
                      </a>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
