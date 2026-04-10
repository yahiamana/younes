"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSocialLink, deleteSocialLink } from "@/app/actions/social";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
}

export default function SocialLinksManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [links, setLinks] = useState(initialLinks);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;
    setAdding(true);
    setError(null);

    // Automatic Protocol Helper: Prepend https:// if missing
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const formData = new FormData();
    formData.set("platform", platform.trim());
    formData.set("url", finalUrl);
    formData.set("order", String(links.length));

    const result = await createSocialLink(formData);
    if (result?.success) {
      setPlatform("");
      setUrl("");
      startTransition(() => {
        router.refresh();
      });
    } else if (result?.error) {
       if (typeof result.error === "string") {
         setError(result.error);
       } else {
         const errs = result.error as Record<string, string[]>;
         const firstKey = Object.keys(errs)[0];
         setError(`${firstKey}: ${errs[firstKey][0]}`);
       }
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const result = await deleteSocialLink(id);
    if (result?.success) {
      setLinks(links.filter((l) => l.id !== id));
      startTransition(() => {
        router.refresh();
      });
    } else {
      setError("Failed to delete link");
    }
  };

  return (
    <div className="admin-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Social Links</h2>
        {isPending && <span className="text-[10px] text-gold/50 animate-pulse font-mono uppercase">Syncing...</span>}
      </div>

      {error && (
        <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          {error}
        </div>
      )}

      {/* Existing Links */}
      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-3 rounded-lg group"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-0.5">{link.platform}</span>
                <span className="text-sm truncate block" style={{ color: "var(--text-secondary)" }}>
                  {link.url}
                </span>
              </div>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20"
                style={{ color: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Link */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="admin-input sm:w-44 text-xs font-bold uppercase tracking-wider"
          required
        >
          <option value="">Select Platform</option>
          <option value="GitHub">GitHub</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter/X</option>
          <option value="YouTube">YouTube</option>
          <option value="Kaggle">Kaggle</option>
          <option value="Medium">Medium</option>
          <option value="Portfolio">Other Portfolio</option>
          <option value="Other">Custom Label</option>
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="admin-input flex-1 font-mono text-sm"
          placeholder="https://..."
          required
        />
        <button type="submit" disabled={adding || isPending} className="btn-primary whitespace-nowrap disabled:opacity-50 text-xs">
          {adding ? "Adding..." : "Connect Link"}
        </button>
      </form>
    </div>
  );
}
