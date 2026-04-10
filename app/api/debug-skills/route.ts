import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany();
    return Response.json({ success: true, count: skills.length, skills });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
