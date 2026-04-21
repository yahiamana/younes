"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

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
          description="Recognized qualifications and continuous learning milestones in data science and engineering."
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
                  className="card-premium h-full flex flex-col group cursor-pointer overflow-hidden"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => cert.imageUrl && setSelectedCert(cert)}
                >
                  {/* Visual Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/20">
                    {cert.imageUrl ? (
                      <Image
                        src={cert.imageUrl}
                        alt={cert.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#e8c97e]/5 border border-[#e8c97e]/10 flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8c97e" strokeWidth="1" className="opacity-40">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141427] via-transparent to-transparent" />
                    
                    {/* Focus Overlay */}
                    {cert.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <span className="px-4 py-2 rounded-full bg-[#e8c97e] text-[#0e0e1c] text-[10px] font-bold uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform">
                          Inspect Credential
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-[#e8c97e] transition-colors leading-tight mb-1">
                          {cert.title}
                        </h3>
                        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-tertiary)" }}>
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
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 -m-2 text-[#e8c97e] hover:text-[#f2d995] transition-colors"
                          title="Verify Externally"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Luxury Lightbox Overlay */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto bg-[#0e0e1c]/90 backdrop-blur-xl"
          >
            <div 
              className="absolute inset-0" 
              onClick={() => setSelectedCert(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-auto md:aspect-video bg-[#141427] rounded-2xl border border-[#e8c97e]/20 shadow-[0_0_100px_rgba(232,201,126,0.1)] overflow-hidden flex flex-col md:flex-row my-auto"
            >
              {/* Image Side */}
              <div className="relative w-full h-64 md:h-auto md:flex-1 bg-black">
                {selectedCert.imageUrl && (
                  <Image
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                )}
              </div>

              {/* Info Sidebar */}
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-white/5 bg-[#0e0e1c]/50 backdrop-blur-sm">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="self-end p-2 -mr-2 mb-4 md:mb-8 text-white/40 hover:text-white transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="flex-1">
                  <p className="text-[#e8c97e] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Official Credential</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{selectedCert.title}</h2>
                  <p className="text-white/60 font-medium mb-6 text-sm md:text-base">{selectedCert.issuer}</p>
                  
                  <div className="space-y-4 py-4 md:py-6 border-y border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Conferred Date</span>
                      <span className="text-white/80 text-xs font-mono">
                        {new Date(selectedCert.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Verification ID</span>
                      <span className="text-white/80 text-xs font-mono lowercase">{selectedCert.id.slice(-8)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-auto space-y-3">
                  {selectedCert.fileUrl && (
                    <a
                      href={selectedCert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-4 rounded-xl bg-[#e8c97e] text-[#0e0e1c] font-bold text-sm tracking-widest uppercase hover:bg-[#f2d995] transition-all flex items-center justify-center gap-2 group"
                    >
                      Verify PDF
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-full px-6 py-4 rounded-xl border border-white/10 text-white/60 font-bold text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all text-center"
                  >
                    Close Terminal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
