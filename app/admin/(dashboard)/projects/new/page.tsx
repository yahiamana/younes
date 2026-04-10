"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions/projects";
import ImageUpload from "../../components/ImageUpload";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createProject(formData);

    if (result?.error) {
      setError(JSON.stringify(result.error));
      setLoading(false);
    } else {
      router.push("/admin/projects");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>

      <form onSubmit={handleSubmit} className="admin-card space-y-5">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label>
          <input name="title" required className="admin-input" placeholder="Project title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Slug</label>
          <input name="slug" required className="admin-input" placeholder="project-slug" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Description</label>
          <textarea name="description" required rows={4} className="admin-input resize-none" placeholder="Project description..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Tech Stack (comma-separated)</label>
          <input name="techStack" required className="admin-input" placeholder="Python, TensorFlow, Pandas" />
        </div>

        <ImageUpload
          label="Project Image"
          name="image"
          folder="portfolio/projects"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Live URL</label>
            <input name="liveUrl" className="admin-input" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>GitHub URL</label>
            <input name="githubUrl" className="admin-input" placeholder="https://github.com/..." />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="featured" value="true" className="rounded" />
            <span style={{ color: "var(--text-secondary)" }}>Featured</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="published" value="true" defaultChecked className="rounded" />
            <span style={{ color: "var(--text-secondary)" }}>Published</span>
          </label>
        </div>

        <input type="hidden" name="order" value="0" />

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? "Creating..." : "Create Project"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
