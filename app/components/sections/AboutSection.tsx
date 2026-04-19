"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import NeuralNexus from "../ui/NeuralNexus";
import ScrollReveal from "../ui/ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  aboutText: string;
  aboutHighlights: string;
  profilePhoto: string | null;
}

export default function AboutSection({ aboutText, aboutHighlights, profilePhoto }: AboutSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [highlights, setHighlights] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      setHighlights(JSON.parse(aboutHighlights));
    } catch {
      // invalid JSON fallback
    }
  }, [aboutHighlights]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Kinetic Typography Reveal Effect
      const words = containerRef.current?.querySelectorAll(".kinetic-word");
      if (words && words.length > 0) {
        gsap.fromTo(words, 
          { 
            opacity: 0,
            y: 20,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.05,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // Card Parallax
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { y: 60, opacity: 0 },
          {
            y: -40,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      }

      // Photo "Scan" entrance
      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { scaleX: 0, opacity: 0 },
          { 
            scaleX: 1, 
            opacity: 1, 
            duration: 1.2, 
            ease: "expo.out",
            scrollTrigger: {
              trigger: photoRef.current,
              start: "top 80%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [aboutText]);

  return (
    <section 
      ref={containerRef} 
      id="about" 
      className="relative min-h-screen py-32 md:py-48 bg-[#0e0e1c] flex items-center overflow-hidden"
    >
      <NeuralNexus />
      
      <div className="container-custom w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Kinetic Story */}
          <div className="flex-[1.2] space-y-12">
            <ScrollReveal>
              <p className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold px-4 py-1.5 border border-white/5 rounded-full inline-block backdrop-blur-sm bg-white/5">
                About Me
              </p>
            </ScrollReveal>
            
            <div 
              ref={textContainerRef} 
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight"
            >
              {aboutText.split(/(\s+)/).map((word, i) => (
                word.trim() === "" ? (
                  <span key={i}>{word}</span>
                ) : (
                  <span 
                    key={i} 
                    className="kinetic-word inline-block mr-[0.2em]"
                  >
                    {word}
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Right Column: Identity Card */}
          <div className="flex-1 w-full max-w-lg">
            <div 
              ref={cardRef}
              className="glass-strong p-8 md:p-12 relative group overflow-hidden"
              style={{ boxShadow: "0 0 50px rgba(255,255,255,0.03)" }}
            >
              {/* Scanline Decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8c97e]/20 to-transparent animate-scan z-20" />

              <div className="absolute top-0 right-0 p-6 opacity-20 z-0">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8c97e" strokeWidth="1" className="animate-spin-slow">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>

              {/* Photo Section: Digital ID style */}
              {profilePhoto && (
                <div className="mb-10 relative">
                  <div 
                    ref={photoRef}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-white/5 group/photo"
                  >
                    <Image
                      src={profilePhoto}
                      alt="Identity"
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80 group-hover/photo:opacity-100 scale-105 group-hover/photo:scale-100"
                    />
                    {/* ID Overlay Graphics */}
                    <div className="absolute inset-0 border-[20px] border-transparent group-hover/photo:border-[#e8c97e]/10 transition-all duration-700 pointer-events-none" />
                    <div className="absolute top-4 left-4 flex flex-col gap-1">
                      <div className="w-4 h-[1px] bg-[#e8c97e]/40" />
                      <div className="w-[1px] h-4 bg-[#e8c97e]/40" />
                    </div>
                    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                      <div className="w-[1px] h-4 bg-[#e8c97e]/40" />
                      <div className="w-4 h-[1px] bg-[#e8c97e]/40" />
                    </div>
                    <div className="absolute top-4 right-4 translate-x-1 translate-y-[-2px]">
                      <span className="text-[8px] font-mono text-[#e8c97e]/40 tracking-[0.2em] uppercase font-bold">Auth_Verified</span>
                    </div>
                    {/* Scan effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e8c97e]/10 to-transparent h-1/2 w-full animate-scan-slow opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

              <h3 className="text-xl text-white font-medium mb-12 tracking-widest uppercase">
                Core Metrics
              </h3>

              <div className="space-y-10">
                {Object.entries(highlights).map(([key, value], idx) => (
                  <div key={idx} className="group/item">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold group-hover/item:text-white/60 transition-colors">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="h-[1px] flex-1 mx-4 bg-white/5 group-hover/item:bg-white/20 transition-all duration-700" />
                    </div>
                    <div className="text-4xl md:text-5xl font-light text-white tracking-tighter group-hover/item:scale-105 transition-transform origin-left duration-500">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer Decoration */}
              <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
                <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                  Identity.Archive_v3
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
