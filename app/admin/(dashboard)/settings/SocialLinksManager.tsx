"use client";

import { useState } from "react";
import { createSocialLink, deleteSocialLink } from "@/app/actions/social";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
}

export default function SocialLinksManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;
    setAdding(true);
    const formData = new FormData();
    formData.set("platform", platform.trim());
    formData.set("url", url.trim());
    formData.set("order", String(links.length));
    const result = await createSocialLink(formData);
    if (result?.success) {
      setPlatform("");
      setUrl("");
      window.location.reload();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSocialLink(id);
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div className="admin-card space-y-6">
      <h2 className="text-lg font-bold">Social Links</h2>

      {/* Existing Links */}
      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <span className="text-sm font-medium w-24">{link.platform}</span>
              <span className="text-sm flex-1 truncate" style={{ color: "var(--text-secondary)" }}>
                {link.url}
              </span>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-xs cursor-pointer px-2 py-1 rounded"
                style={{ color: "#ef4444" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Link */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="admin-input sm:w-40"
          required
        >
          <option value="">Platform</option>
          <option value="GitHub">GitHub</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter</option>
          <option value="YouTube">YouTube</option>
          <option value="Kaggle">Kaggle</option>
          <option value="Medium">Medium</option>
          <option value="Other">Other</option>
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="admin-input flex-1"
          placeholder="https://..."
          required
        />
        <button type="submit" disabled={adding} className="btn-primary whitespace-nowrap disabled:opacity-50">
          {adding ? "Adding..." : "Add Link"}
        </button>
      </form>
    </div>
  );
}
