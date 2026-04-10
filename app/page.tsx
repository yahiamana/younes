import { prisma } from "@/lib/db";
import HomeClient from "./HomeClient";

async function getData() {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!settings) {
      await prisma.siteSettings.create({ data: {} });
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

    return { 
      settings: settings || {
        id: "temp",
        name: "Younes Benali",
        title: "Data Scientist | ML & DL Engineer",
        heroHeadline: "Turning Data into Impact",
        heroSubtext: "Machine Learning & AI Builder dedicated to solving complex problems.",
        aboutText: "Younes Benali is a Data Scientist and Machine Learning Engineer...",
        aboutHighlights: JSON.stringify({ experience: "3+", projects: "20+", certificates: "10+", specialization: "ML/DL" }),
        phone: "0561020056",
        email: "younes.bnl@yahoo.com",
        profilePhoto: null,
        resumeUrl: null,
        seoTitle: "Younes Benali",
        seoDescription: "Data Science Portfolio",
        ogImage: null,
      }, 
      projects, 
      certificates, 
      skills, 
      socialLinks 
    };
  } catch (err) {
    console.error("Home Data Fetch Error:", err);
    return {
      settings: {
        id: "default",
        name: "Younes Benali",
        title: "Data Scientist | ML & DL Engineer",
        heroHeadline: "Turning Data into Impact",
        heroSubtext: "Machine Learning & Deep Learning Engineer | NLP & AI Builder",
        aboutText: "Younes Benali is a Data Scientist...",
        aboutHighlights: JSON.stringify({ experience: "3+", projects: "20+", certificates: "10+", specialization: "ML/DL" }),
        phone: "0561020056",
        email: "younes.bnl@yahoo.com",
        profilePhoto: null,
        resumeUrl: null,
        seoTitle: "Younes Benali — Portfolio",
        seoDescription: "Data Science & AI Portfolio",
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
