"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ui/ProjectCard";

interface Project {
  id: string;
  title: string;
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
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Machine Learning", "Data Science", "Web Development", "Deep Learning"];
  
  // Simple heuristic for category matching based on tech stack or title
  const filteredProjects = projects.filter(p => {
    if (filter === "All") return true;
    const searchStr = (p.title + " " + p.techStack.join(" ")).toLowerCase();
    return searchStr.includes(filter.toLowerCase());
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#020204]">
      <div className="container-custom">
        {/* Header */}
        <div className="relative mb-20 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.5em] text-blue-500 font-bold mb-4 block"
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

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-4 mb-16 pb-4 border-b border-white/5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 border ${
                filter === cat 
                  ? "bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Professional Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id}
                {...project}
                index={idx}
                featured={false} // Standardize all for cleaner archive look
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-white/20 uppercase tracking-widest">No projects matching the selected intelligence filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
