"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import CertificatesSection from "./components/sections/CertificatesSection";
import SkillsSection from "./components/sections/SkillsSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/layout/Footer";

const LenisProvider = dynamic(
  () => import("./components/providers/LenisProvider"),
  { ssr: false }
);

interface Props {
  settings: {
    name: string;
    title: string;
    heroHeadline: string;
    heroSubtext: string;
    aboutText: string;
    phone: string;
    email: string;
    profilePhoto: string | null;
  };
  projects: {
    id: string;
    title: string;
    slug: string;
    description: string;
    techStack: string[];
    image: string | null;
    liveUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
  }[];
  certificates: {
    id: string;
    title: string;
    issuer: string;
    date: string; // Serialized ISO string
    imageUrl: string | null;
    fileUrl: string | null;
  }[];
  skills: {
    id: string;
    name: string;
    category: string;
  }[];
  socialLinks: {
    id: string;
    platform: string;
    url: string;
  }[];
  highlights: {
    experience?: string;
    projects?: string;
    certificates?: string;
    specialization?: string;
  };
}

export default function HomeClient({
  settings,
  projects,
  certificates,
  skills,
  socialLinks,
  highlights,
}: Props) {
  return (
    <LenisProvider>
      <Navbar name={settings.name} />
      <main>
        <HeroSection
          headline={settings.heroHeadline}
          subtext={settings.heroSubtext}
          profilePhoto={settings.profilePhoto}
        />
        <AboutSection 
          aboutText={settings.aboutText} 
          aboutHighlights={JSON.stringify(highlights)} 
          profilePhoto={settings.profilePhoto}
        />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <SkillsSection skills={skills} />
        <ContactSection phone={settings.phone} email={settings.email} />
      </main>
      <Footer
        name={settings.name}
        email={settings.email}
        phone={settings.phone}
        socialLinks={socialLinks}
      />
    </LenisProvider>
  );
}
