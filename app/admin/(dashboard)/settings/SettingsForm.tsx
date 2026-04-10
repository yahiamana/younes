"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import ImageUpload from "../components/ImageUpload";

interface Settings {
  id: string;
  name: string;
  title: string;
  heroHeadline: string;
  heroSubtext: string;
  aboutText: string;
  aboutHighlights: string;
  phone: string;
  email: string;
  profilePhoto: string | null;
  resumeUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);
    
    if (result?.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else {
        // Field errors from Zod
        const errs = result.error as Record<string, string[]>;
        const firstField = Object.keys(errs)[0];
        const firstMsg = errs[firstField]?.[0];
        setError(`${firstField}: ${firstMsg}`);
      }
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-6">
      <h2 className="text-lg font-bold">Site Identity</h2>

      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>{error}</div>
      )}
      {saved && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>Settings saved successfully!</div>
      )}

      <ImageUpload
        label="Profile Photo"
        name="profilePhoto"
        defaultValue={settings.profilePhoto || ""}
        folder="portfolio/profile"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
          <input name="name" required className="admin-input" defaultValue={settings.name} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label>
          <input name="title" required className="admin-input" defaultValue={settings.title} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Hero Headline</label>
        <input name="heroHeadline" required className="admin-input" defaultValue={settings.heroHeadline} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Hero Subtext</label>
        <textarea name="heroSubtext" rows={2} className="admin-input resize-none" defaultValue={settings.heroSubtext} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>About Text</label>
        <textarea name="aboutText" rows={6} className="admin-input resize-none" defaultValue={settings.aboutText} />
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Separate paragraphs with blank lines</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>About Highlights (JSON)</label>
        <textarea name="aboutHighlights" rows={3} className="admin-input resize-none font-mono text-sm" defaultValue={settings.aboutHighlights} />
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {`Format: {"experience":"3+","projects":"20+","certificates":"10+","specialization":"ML/DL"}`}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Phone</label>
          <input name="phone" className="admin-input" defaultValue={settings.phone} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
          <input name="email" type="email" required className="admin-input" defaultValue={settings.email} />
        </div>
      </div>

      <hr style={{ borderColor: "var(--border-subtle)" }} />
      <h2 className="text-lg font-bold">SEO Settings</h2>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>SEO Title</label>
        <input name="seoTitle" className="admin-input" defaultValue={settings.seoTitle} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>SEO Description</label>
        <textarea name="seoDescription" rows={2} className="admin-input resize-none" defaultValue={settings.seoDescription} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>OG Image URL</label>
        <input name="ogImage" className="admin-input" defaultValue={settings.ogImage || ""} />
      </div>

      <input type="hidden" name="resumeUrl" value={settings.resumeUrl || ""} />

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
