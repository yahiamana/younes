import { prisma } from "@/lib/db";
import ProjectsPageClient from "./ProjectsPageClient";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

async function getProjectData() {
  const [projects, settings, socialLinks] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    }),
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return {
    projects,
    settings: settings || { name: "Younes", email: "younes.bnl@yahoo.com", phone: "0561020056" },
    socialLinks,
  };
}

export default async function ProjectsPage() {
  const data = await getProjectData();

  return (
    <>
      <Navbar name={data.settings.name || "Younes"} />
      <main>
        <ProjectsPageClient projects={data.projects} />
      </main>
      <Footer 
        name={data.settings.name || "Younes"} 
        email={data.settings.email || ""} 
        phone={data.settings.phone || ""}
        socialLinks={data.socialLinks}
      />
    </>
  );
}
