"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
        const errs = result.error as Record<string, string[]>;
        const firstField = Object.keys(errs)[0];
        const firstMsg = errs[firstField]?.[0];
        setError(`${firstField}: ${firstMsg}`);
      }
    } else {
      setSaved(true);
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setSaved(false), 5000);
    }
    setLoading(false);
  };

  const sectionLabelStyle = "text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-6 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      
      {/* Status Bar */}
      {(error || saved || loading) && (
        <div className="sticky top-0 z-50 py-4 pointer-events-none">
          {error && (
            <div className="admin-card !bg-red-500/10 border-red-500/20 text-red-400 p-4 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
              {error}
            </div>
          )}
          {saved && (
            <div className="admin-card !bg-green-500/10 border-green-500/20 text-green-400 p-4 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
              Settings updated and revalidated successfully!
            </div>
          )}
          {loading && (
            <div className="admin-card !bg-white/5 border-white/10 text-white/60 p-4 animate-pulse pointer-events-auto">
              Syncing with database...
            </div>
          )}
        </div>
      )}

      {/* Global & Profile Section */}
      <div className="admin-card space-y-8">
        <div>
          <span className={sectionLabelStyle}>Identity & Assets</span>
          <div className="grid md:grid-cols-2 gap-8">
            <ImageUpload
              label="Profile Photo"
              name="profilePhoto"
              defaultValue={settings.profilePhoto || ""}
              folder="portfolio/profile"
            />
            <ImageUpload
              label="Resume / CV (PDF or Image)"
              name="resumeUrl"
              defaultValue={settings.resumeUrl || ""}
              folder="portfolio/resume"
              accept="application/pdf,image/*"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Official Name</label>
            <input name="name" required className="admin-input" defaultValue={settings.name} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Professional Title</label>
            <input name="title" required className="admin-input" defaultValue={settings.title} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="admin-card space-y-6">
        <span className={sectionLabelStyle}>Hero Section Reveal</span>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Headline</label>
          <input name="heroHeadline" required className="admin-input" defaultValue={settings.heroHeadline} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Subtext</label>
          <textarea name="heroSubtext" rows={2} className="admin-input resize-none" defaultValue={settings.heroSubtext} />
        </div>
      </div>

      {/* About Section */}
      <div className="admin-card space-y-6">
        <span className={sectionLabelStyle}>The Narrative & Metrics</span>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Narrative Biography</label>
          <textarea name="aboutText" rows={6} className="admin-input resize-none" defaultValue={settings.aboutText} />
          <p className="text-[10px] mt-1 text-white/20">Supports plain text with double line-breaks for paragraphs.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Metrics Stats (JSON)</label>
          <textarea name="aboutHighlights" rows={3} className="admin-input resize-none font-mono text-sm" defaultValue={settings.aboutHighlights} />
          <p className="text-[10px] mt-1 text-[#e8c97e]/40 font-mono">
            {`Structure: {"experience":"3+ Years","projects":"20+","impact":"Global"}`}
          </p>
        </div>
      </div>

      {/* Contact & SEO */}
      <div className="admin-card space-y-8">
        <span className={sectionLabelStyle}>Communication & SEO</span>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Public Phone</label>
            <input name="phone" className="admin-input" defaultValue={settings.phone} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Public Email</label>
            <input name="email" type="email" required className="admin-input" defaultValue={settings.email} />
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-white/5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Search Title</label>
            <input name="seoTitle" className="admin-input" defaultValue={settings.seoTitle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60 font-mono text-[10px] uppercase">Search Description</label>
            <textarea name="seoDescription" rows={2} className="admin-input resize-none" defaultValue={settings.seoDescription} />
          </div>
          <ImageUpload
            label="Social Sharing Image (OG Image)"
            name="ogImage"
            defaultValue={settings.ogImage || ""}
            folder="portfolio/seo"
          />
        </div>
      </div>

      <div className="flex justify-end sticky bottom-8">
        <button 
          type="submit" 
          disabled={loading || isPending} 
          className="btn-primary shadow-2xl shadow-gold/20 disabled:opacity-50 min-w-[200px]"
        >
          {loading ? "Persisting..." : isPending ? "Refreshing..." : "Commit Settings"}
        </button>
      </div>
    </form>
  );
}
