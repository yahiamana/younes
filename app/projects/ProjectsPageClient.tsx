"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ui/ProjectCard";

interface Project {
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

interface Props {
  projects: Project[];
}

export default function ProjectsPageClient({ projects }: Props) {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0e0e1c]">
      <div className="container-custom">
        {/* Header */}
        <div className="relative mb-20 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.5em] text-[#e8c97e] font-bold mb-4 block"
          >
            Project Archive
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none"
          >
            Synthesized <br /> <span className="text-white/20 italic">Intelligence</span>
          </motion.h1>
          
          <div className="absolute top-0 right-0 hidden lg:block opacity-20">
            <span className="text-[120px] font-bold font-mono text-white/5 select-none leading-none">
              {projects.length}
            </span>
          </div>
        </div>

        {/* Professional Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project, idx) => (
              <ProjectCard 
                key={project.id}
                {...project}
                index={idx}
                featured={false} // Standardize all for cleaner archive look
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {projects.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-white/20 uppercase tracking-widest">No projects found in the archive.</p>
          </div>
        )}
      </div>
    </div>
  );
}
