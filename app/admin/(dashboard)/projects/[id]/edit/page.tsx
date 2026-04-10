import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <EditProjectForm project={project} />
    </div>
  );
}
