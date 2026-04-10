"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProjectCard from "../ui/ProjectCard";
import ScrollReveal from "../ui/ScrollReveal";

interface ProjectSubset {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  image: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
}

interface ProjectsSectionProps {
  projects: ProjectSubset[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Show top 4 or featured ones on home page
  const featuredProjects = projects
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 4);

  return (
    <section 
      id="projects" 
      className="relative py-32 bg-[#020204] overflow-hidden"
    >
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="mb-20">
          <ScrollReveal>
            <span className="text-blue-500 uppercase tracking-[0.5em] text-xs font-bold mb-4 block">
              Strategic Showcase
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-none">
              Featured <span className="text-white/20 italic font-light">Intelligence</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Vertical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {featuredProjects.map((project, i) => (
            <div 
              key={project.id}
              className={`${i % 2 !== 0 ? "md:mt-24" : ""}`} // Staggered visual hierarchy
            >
              <ProjectCard 
                {...project}
                index={i}
                featured={false}
              />
            </div>
          ))}
        </div>

        {/* Section Footer / View All */}
        <div className="mt-32 text-center">
          <ScrollReveal>
            <h3 className="text-2xl text-white/40 mb-10 font-light tracking-wide">
              Explore the complete architecture of my technical portfolio.
            </h3>
            <Link 
              href="/projects" 
              className="group relative inline-flex items-center gap-4 px-12 py-5 rounded-full border border-white/10 hover:border-blue-500/50 transition-all duration-500 bg-white/[0.02] overflow-hidden"
            >
              <span className="relative z-10 text-white font-bold tracking-[0.2em] text-xs uppercase">
                View Full Project Archive
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                className="relative z-10 translate-x-0 group-hover:translate-x-2 transition-transform duration-500"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-purple-500/[0.02] blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
}
