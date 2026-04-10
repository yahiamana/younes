import { prisma } from "@/lib/db";
import HomeClient from "./HomeClient";

async function getData() {
  try {
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

    // Explicit serialization to pass from Server to Client safely
    const serializedSettings = {
      name: settings?.name || "Younes Benali",
      title: settings?.title || "Data Scientist | ML & DL Engineer",
      heroHeadline: settings?.heroHeadline || "Turning Data into Impact",
      heroSubtext: settings?.heroSubtext || "Machine Learning & AI Builder",
      aboutText: settings?.aboutText || "",
      aboutHighlights: settings?.aboutHighlights || "{}",
      phone: settings?.phone || "",
      email: settings?.email || "",
      profilePhoto: settings?.profilePhoto || null,
      resumeUrl: settings?.resumeUrl || null,
    };

    const serializedProjects = projects.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      techStack: p.techStack,
      image: p.image,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      featured: p.featured,
    }));

    const serializedCertificates = certificates.map(c => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date.toISOString(), // CRITICAL: Dates must be strings for serialization
      imageUrl: c.imageUrl,
      fileUrl: c.fileUrl,
    }));

    const serializedSkills = skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
    }));

    const serializedSocialLinks = socialLinks.map(sl => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
    }));

    return { 
      settings: serializedSettings, 
      projects: serializedProjects, 
      certificates: serializedCertificates, 
      skills: serializedSkills, 
      socialLinks: serializedSocialLinks 
    };
  } catch (err) {
    console.error("Home Data Fetch Error (RSC Serialization Fail):", err);
    return {
      settings: {
        name: "Younes Benali",
        title: "Data Scientist | ML & DL Engineer",
        heroHeadline: "Turning Data into Impact",
        heroSubtext: "Machine Learning & Deep Learning Engineer",
        aboutText: "Error loading content. Please check database connection.",
        aboutHighlights: "{}",
        phone: "",
        email: "younes.bnl@yahoo.com",
        profilePhoto: null,
        resumeUrl: null,
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

  let highlights = {};
  try {
    if (data.settings.aboutHighlights) {
      highlights = JSON.parse(data.settings.aboutHighlights);
    }
  } catch (err) {
    console.error("Highlights JSON Parse Error:", err);
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
