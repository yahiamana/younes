import { prisma } from "@/lib/db";
import Link from "next/link";
import ProjectActions from "./ProjectActions";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch { /* db not connected */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          + New Project
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        {projects.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}>
                        Featured
                      </span>
                    )}
                    {!project.published && (
                      <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                    {project.techStack.join(", ")}
                  </p>
                </div>
                <ProjectActions projectId={project.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: "var(--text-tertiary)" }}>
            <p>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
}
