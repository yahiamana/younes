import { prisma } from "@/lib/db";
import HomeClient from "./HomeClient";

async function getData() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    const [projects, certificates, skills, socialLinks] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.certificate.findMany({
        orderBy: [{ order: "asc" }, { date: "desc" }],
      }),
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      }),
      prisma.socialLink.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    return { settings, projects, certificates, skills, socialLinks };
  } catch {
    // Return defaults if database is not connected yet
    return {
      settings: {
        id: "default",
        name: "Younes",
        title: "Data Scientist & ML/DL Engineer",
        heroHeadline: "Transforming Data Into Intelligence",
        heroSubtext: "Crafting intelligent systems through data science, machine learning, and deep learning.",
        aboutText: "I am a passionate Data Scientist and Machine Learning / Deep Learning Engineer.",
        aboutHighlights: JSON.stringify({ experience: "3+", projects: "20+", certificates: "10+", specialization: "ML/DL" }),
        phone: "0561020056",
        email: "younes.bnl@yahoo.com",
        profilePhoto: null,
        resumeUrl: null,
        seoTitle: "Younes — Data Scientist & ML/DL Engineer",
        seoDescription: "Portfolio of Younes",
        ogImage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      projects: [],
      certificates: [],
      skills: [],
      socialLinks: [],
    };
  }
}

export default async function HomePage() {
  const data = await getData();

  let highlights = { experience: "3+", projects: "20+", certificates: "10+", specialization: "ML/DL" };
  try {
    if (data.settings.aboutHighlights) {
      highlights = JSON.parse(data.settings.aboutHighlights);
    }
  } catch {
    // use defaults
  }

  return (
    <HomeClient
      settings={data.settings}
      projects={data.projects}
      certificates={data.certificates}
      skills={data.skills}
      socialLinks={data.socialLinks}
      highlights={highlights}
    />
  );
}
