import { prisma } from "@/lib/db";
import SkillsManager from "./SkillsManager";

export default async function AdminSkillsPage() {
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
  } catch { /* db not connected */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage your technical skills and expertise
        </p>
      </div>
      <SkillsManager initialSkills={skills} />
    </div>
  );
}
