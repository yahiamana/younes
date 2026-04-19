"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  image: string | null;
  techStack: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  index: number;
}

export default function ProjectCard({
  title,
  slug,
  description,
  image,
  techStack,
  liveUrl,
  githubUrl,
  featured,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#141427] backdrop-blur-sm transition-all duration-500 hover:border-[#e8c97e]/20"
    >
      {/* Card Content Overlay Link (Makes entire card clickable) */}
      <Link 
        href={`/projects/${slug}`} 
        className="absolute inset-0 z-10"
        aria-label={`View ${title} details`}
      />

      {/* Visual Header / Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <span className="text-white/20 uppercase tracking-widest text-xs">No Visual Data</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c] via-transparent to-transparent opacity-60" />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#e8c97e]/10 border border-[#e8c97e]/20 backdrop-blur-md z-20">
            <span className="text-[10px] font-bold text-[#e8c97e] uppercase tracking-tighter">Strategic Asset</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#e8c97e] transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-3 text-sm text-white/50 line-clamp-2 font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-auto pt-6 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest bg-white/5 border border-white/5 text-white/40 group-hover:border-[#e8c97e]/30 group-hover:text-[#e8c97e] transition-all"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 relative z-20">
          <div className="flex gap-4">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 hover:text-white transition-colors p-2 -m-2"
                title="Live Demonstration"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 hover:text-white transition-colors p-2 -m-2"
                title="Source Repository"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            )}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">
            Insights →
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#e8c97e]/5 blur-[60px] rounded-full group-hover:bg-[#e8c97e]/10 transition-all duration-700 pointer-events-none" />
    </motion.div>
  );
}
