"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/app/actions/projects";
import ImageUpload from "../../../components/ImageUpload";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  image: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
}

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProject(project.id, formData);

    if (result?.error) {
      setError(JSON.stringify(result.error));
      setLoading(false);
    } else {
      router.push("/admin/projects");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-5">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label>
        <input name="title" required className="admin-input" defaultValue={project.title} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Slug</label>
        <input name="slug" required className="admin-input" defaultValue={project.slug} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Description</label>
        <textarea name="description" required rows={4} className="admin-input resize-none" defaultValue={project.description} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Tech Stack (comma-separated)</label>
        <input name="techStack" required className="admin-input" defaultValue={project.techStack.join(", ")} />
      </div>

      <ImageUpload
        label="Project Image"
        name="image"
        defaultValue={project.image || ""}
        folder="portfolio/projects"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Live URL</label>
          <input name="liveUrl" className="admin-input" defaultValue={project.liveUrl || ""} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>GitHub URL</label>
          <input name="githubUrl" className="admin-input" defaultValue={project.githubUrl || ""} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" name="featured" value="true" defaultChecked={project.featured} className="rounded" />
          <span style={{ color: "var(--text-secondary)" }}>Featured</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" name="published" value="true" defaultChecked={project.published} className="rounded" />
          <span style={{ color: "var(--text-secondary)" }}>Published</span>
        </label>
      </div>

      <input type="hidden" name="order" value={project.order} />

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
