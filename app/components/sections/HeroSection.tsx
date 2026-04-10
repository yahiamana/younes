"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import NeuralBackground from "../ui/NeuralBackground";
import MagneticButton from "../ui/MagneticButton";

interface HeroSectionProps {
  headline: string;
  subtext: string;
  profilePhoto: string | null;
}

export default function HeroSection({ headline, subtext, profilePhoto }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial Entrance
      tl.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, delay: 0.1 }
      )
      .fromTo(
        textRef.current,
        { y: 80, opacity: 0, rotateX: -20, scale: 0.95 },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.5 },
        "-=1.2"
      )
      .fromTo(
        subtextRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.0"
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      );

      // Subtle continuous floating for the image
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: 15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-12"
      style={{ perspective: "1000px" }}
    >
      <NeuralBackground />

      <div className="z-10 container-custom flex flex-col items-center text-center relative">
        
        {/* Profile Image Container */}
        {profilePhoto && (
          <div 
            ref={imageRef}
            className="relative mb-10 group"
          >
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 -m-4 bg-gradient-to-tr from-[#e8c97e]/15 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 opacity-60" />
            <div className="absolute inset-0 -m-1 bg-gradient-to-tr from-[#e8c97e]/20 to-transparent rounded-full border border-[#e8c97e]/10" />
            
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/10 backdrop-blur-sm grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 shadow-2xl">
              <Image
                src={profilePhoto}
                alt="Profile"
                fill
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700 font-sans"
                priority
              />
            </div>

            {/* Subtle decorative elements */}
            {/* Subtle decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#e8c97e] rounded-full border-4 border-[#0e0e1c] z-20 shadow-[0_0_15px_rgba(232,201,126,0.5)]" />
          </div>
        )}

        {/* Subtle top badge if no photo or as secondary info */}
        {!profilePhoto && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">
              Premium Interactive Portfolio
            </span>
          </motion.div>
        )}

        <h1 
          ref={textRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] text-white"
          style={{ textShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
        >
          {headline.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-[2vw]">
              {word}
            </span>
          ))}
        </h1>
        
        <p 
          ref={subtextRef}
          className="mt-8 md:mt-10 text-lg md:text-xl text-white/50 max-w-2xl font-light tracking-wide leading-relaxed"
        >
          {subtext}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <MagneticButton>
            <a 
              href="#projects" 
              className="btn-primary"
            >
              <span>View My Work</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-0 group-hover:translate-x-1 transition-transform">
                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </a>
          </MagneticButton>

          <MagneticButton>
            <a 
              href="#contact" 
              className="btn-secondary px-10"
            >
              Contact Me
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* Floating Foreground Light */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#e8c97e]/5 blur-[100px] rounded-[100%]" />
    </section>
  );
}
