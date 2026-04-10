"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillSubset {
  id: string;
  name: string;
  category: string;
}

interface SkillsSectionProps {
  skills: SkillSubset[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const badges = sectionRef.current?.querySelectorAll(".skill-badge");
      if (!badges || badges.length === 0) return;

      // General Stagger Entry
      gsap.fromTo(
        badges,
        { y: 50, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.03,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [skills]);

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillSubset[]>);

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 bg-[#0e0e1c] overflow-hidden">
      <div className="container-custom relative z-10" ref={containerRef}>
        <div className="max-w-7xl mx-auto">
          <p className="text-white/40 uppercase tracking-[0.3em] text-sm mb-16 font-medium text-center md:text-left">Tech Stack & Tools</p>
          
          {skills.length === 0 ? (
            <div className="w-full h-80 flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-3xl relative overflow-hidden">
              <h3 className="text-xl md:text-2xl font-light text-white/30 tracking-widest text-center">
                INITIALIZING TOOLSET...
              </h3>
            </div>
          ) : (
            <div className="space-y-24">
              {Object.entries(grouped).map(([category, items], i) => (
                <div key={category} className="flex flex-col md:flex-row gap-8 md:gap-24 border-t border-white/5 pt-12">
                  <div className="w-full md:w-64 flex-shrink-0">
                    <h3 className="text-2xl md:text-3xl font-light text-white/90 sticky top-32">
                      {category}
                    </h3>
                  </div>
                  
                  <div className="flex-1 flex flex-wrap gap-4 md:gap-6">
                    {items.map((skill) => (
                      <MagneticButton key={skill.id} className="skill-badge group">
                        <div className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 font-medium tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(232,201,126,0.1)] hover:border-[#e8c97e]/40 hover:bg-[#e8c97e]/10 hover:text-[#e8c97e] transition-all cursor-none flex items-center justify-center">
                          {skill.name}
                        </div>
                      </MagneticButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative blurred orbit */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#e8c97e]/5 blur-[200px] rounded-full pointer-events-none" />
    </section>
  );
}
