import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Younes Portfolio`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 100),
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings, socialLinks] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
    }),
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const siteName = settings?.name || "Younes";

  return (
    <>
      <Navbar name={siteName} />
      <main>
        <ProjectDetailClient project={project} />
      </main>
      <Footer 
        name={siteName} 
        email={settings?.email || ""} 
        phone={settings?.phone || ""}
        socialLinks={socialLinks}
      />
    </>
  );
}
