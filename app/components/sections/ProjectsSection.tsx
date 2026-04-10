"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import MagneticButton from "../ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !scrollContainerRef.current) return;
      const totalProjects = scrollContainerRef.current.children.length;

      if (totalProjects > 0) {
        const xOffset = -(totalProjects - 1) * 100 + "vw";

        gsap.to(scrollContainerRef.current, {
          x: xOffset,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + scrollContainerRef.current!.offsetWidth,
          },
        });

        gsap.utils.toArray<HTMLElement>(".project-image").forEach((img) => {
          gsap.to(img, {
            xPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + scrollContainerRef.current!.offsetWidth,
              scrub: true,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="relative h-screen bg-[#020204] overflow-hidden"
    >
      <div 
        ref={scrollContainerRef}
        className="flex h-full w-[max-content]"
      >
        {projects.length === 0 ? (
          <div className="h-full w-screen flex flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
            <h3 className="text-4xl md:text-5xl font-light text-white/40 mb-4 tracking-widest text-center">
              PROJECT ARCHIVE
            </h3>
            <p className="text-white/20 uppercase tracking-[0.5em] text-sm text-center">
              Awaiting New Entries
            </p>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          </div>
        ) : (
          projects.map((project, i) => (
            <div 
              key={project.id} 
              className="h-full w-screen flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-12"
            >
              {/* Project Info */}
              <div className="flex-1 max-w-xl z-10 flex flex-col items-start">
                <span className="text-white/40 tracking-widest uppercase text-sm mb-4">
                  0{i + 1} / {String(projects.length).padStart(2, "0")}
                </span>
                <h3 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                  {project.title}
                </h3>
                <p className="text-lg text-white/60 mb-8 font-light leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6">
                  {project.liveUrl && (
                    <MagneticButton>
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white border-b border-white pb-1 hover:text-white/70 transition-colors">
                        Live View
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="rotate-45 relative top-[-1px]"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor"></path></svg>
                      </a>
                    </MagneticButton>
                  )}
                  {project.githubUrl && (
                    <MagneticButton>
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 border-b border-white/30 pb-1 hover:text-white transition-colors">
                        Repository
                      </a>
                    </MagneticButton>
                  )}
                </div>
              </div>

              {/* Project Image */}
              <div className="flex-1 w-full max-w-3xl h-[40vh] md:h-[70vh] relative overflow-hidden rounded-[2rem] border border-white/10 group cursor-none">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                {project.image ? (
                  <div className="w-full h-full transform scale-125 project-image">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 project-image scale-125">
                    <span className="text-white/20">No Image</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
