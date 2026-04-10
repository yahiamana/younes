"use client";

import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`text-center mb-16 md:mb-20 ${className}`}>
      <ScrollReveal>
        <span
          className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-full mb-6"
          style={{
            background: "var(--accent-glow)",
            color: "var(--accent-secondary)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          {label}
        </span>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={0.2}>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
