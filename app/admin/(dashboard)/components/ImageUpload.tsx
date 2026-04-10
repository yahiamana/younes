"use client";

import { useState } from "react";

interface ImageUploadProps {
  label: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  accept?: string;
}

export default function ImageUpload({ 
  label, 
  name, 
  defaultValue = "", 
  folder = "portfolio",
  accept = "image/*" 
}: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed due to network error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="flex flex-col gap-3">
        {preview && (
          preview.toLowerCase().endsWith(".pdf") ? (
            <div className="text-sm break-all p-4 rounded-lg bg-white/5 border border-white/10" style={{ color: "var(--text-secondary)" }}>
              <div className="flex items-center gap-2 mb-2 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                </svg>
                <span className="font-medium">Uploaded PDF Document</span>
              </div>
              <a href={preview} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-[#e8c97e] transition-colors">{preview}</a>
            </div>
          ) : (
            <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-white/10 bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Upload preview" className="w-full h-auto object-cover max-h-[300px]" />
            </div>
          )
        )}
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept={accept}
            onChange={handleUpload}
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
            disabled={uploading}
          />
          {uploading && <span className="text-sm" style={{ color: "var(--accent-primary)" }}>Uploading...</span>}
        </div>
        {error && <span className="text-sm" style={{ color: "#ef4444" }}>{error}</span>}
      </div>
      <input type="hidden" name={name} value={preview} />
    </div>
  );
}
