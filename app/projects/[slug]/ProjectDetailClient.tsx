"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@prisma/client";
import NeuralBackground from "../../components/ui/NeuralBackground";
import ScrollReveal from "../../components/ui/ScrollReveal";

interface Props {
  project: Project;
}

export default function ProjectDetailClient({ project }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Parallax for the main image
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Split description by newlines to support paragraphs
  const paragraphs = project.description.split("\n").filter(p => p.trim() !== "");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
      )
      .fromTo(
        imageContainerRef.current,
        { scale: 0.95, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5 },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0e0e1c] text-white selection:bg-[#e8c97e]/30 selection:text-white">
      {/* Immersive Neural Background */}
      <NeuralBackground />
      
      {/* HERO SECTION - Focused on real project data */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          
          {/* Back Navigation */}
          <ScrollReveal>
            <Link 
              href="/projects" 
              className="group inline-flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all duration-500 text-xs uppercase tracking-[0.6em] font-bold mb-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Archives
            </Link>
          </ScrollReveal>

          {/* Project Title from Database */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.8] mb-16"
          >
            <span className="block mb-2">{project.title.split(' ')[0]}</span>
            {project.title.split(' ').length > 1 && (
              <span className="text-[var(--text-tertiary)] italic font-light block opacity-50">
                {project.title.split(' ').slice(1).join(' ')}
              </span>
            )}
          </h1>

          {/* Project Image Showcase from Database */}
          <div 
            ref={imageContainerRef}
            className="relative mx-auto max-w-[1100px] group"
          >
            {/* Premium Window Frame */}
            <div className="relative aspect-video rounded-t-2xl md:rounded-t-3xl overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-[var(--bg-secondary)]">
              {/* Decorative Window Strip */}
              <div className="h-8 md:h-12 border-b border-white/5 bg-white/[0.03] flex items-center px-6 gap-2">
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-white/10" />
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-white/10" />
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-white/10" />
              </div>
              
              {/* Image with zero masking/obstruction */}
              <div className="relative h-full w-full overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)]">
                    <span className="font-mono text-[var(--text-tertiary)] tracking-[2em] uppercase text-xs">Visualizing System</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT META STRIP - Tech Stack & Links from Admin Panel */}
      <section className="relative z-20 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
        <div className="container-custom py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Tech Stack from DB */}
            <div className="flex-1 flex flex-wrap justify-center md:justify-start gap-3">
              {project.techStack.map((tech) => (
                <span 
                  key={tech}
                  className="px-5 py-2 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] bg-white/5 border border-white/10 text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Direct External Links from DB */}
            <div className="flex items-center gap-6">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <span>Launch Live Demo</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group p-4 rounded-full border border-white/10 bg-white/5 hover:border-[var(--accent-primary)] transition-all duration-500"
                  title="Source Code"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT DESCRIPTION SECTION */}
      <section className="relative py-32 md:py-48">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-16">
            <ScrollReveal>
              <div className="flex items-center gap-8 mb-16">
                <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-[var(--accent-primary)] whitespace-nowrap">About Project</span>
                <span className="h-px flex-1 bg-[var(--border-subtle)]" />
              </div>
            </ScrollReveal>
            
            <div className="space-y-12">
              {paragraphs.map((para, i) => (
                <ScrollReveal key={i}>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/70 leading-[1.6] tracking-tight">
                    {para}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NAVIGATION */}
      <section className="py-44 border-t border-white/5 bg-white/[0.01]">
        <div className="container-custom text-center relative z-10">
          <ScrollReveal>
            <div className="space-y-12">
              <p className="text-[10px] uppercase tracking-[1em] font-bold text-white/20">Discovery Cycle</p>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
                Explore <br /> <span className="text-white/20 italic font-light ml-[10%]">More Work</span>
              </h2>
              <Link 
                href="/projects" 
                className="group relative inline-flex items-center gap-10 px-16 py-8 rounded-full border border-white/10 hover:border-[#e8c97e]/40 transition-all duration-700 bg-[var(--bg-secondary)] overflow-hidden"
              >
                <span className="relative z-10 font-bold tracking-[0.4em] uppercase text-xs">Full Project Index</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#e8c97e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
