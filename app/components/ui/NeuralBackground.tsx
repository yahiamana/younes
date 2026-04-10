"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  alpha: number;
  type: "star" | "dust";
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const count = Math.min(width < 768 ? 80 : 150, 150); // Optimized count
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.1,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random(),
        type: Math.random() > 0.85 ? "star" : "dust",
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Performance optimization
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Use IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.003;
      const time = timeRef.current;

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.04;
      m.y += (m.targetY - m.y) * 0.04;

      // Draw background (no clearRect needed with alpha: false)
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      // Deep celestial ambient aura
      const auroraGradient = ctx.createRadialGradient(
        width / 2 + Math.sin(time) * 300, 
        height / 2 + Math.cos(time) * 200, 
        0,
        width / 2, height / 2, Math.max(width, height) * 0.9
      );
      auroraGradient.addColorStop(0, "rgba(255, 255, 255, 0.03)");
      auroraGradient.addColorStop(0.4, "rgba(160, 160, 200, 0.01)");
      auroraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        if (p.type === "star") {
          const brightness = Math.abs(Math.sin(time * 5 + p.x * 0.01));
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * brightness})`;
        } else {
          ctx.fillStyle = `rgba(200, 200, 220, ${p.alpha * 0.15})`;
        }
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
