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
        {preview && accept.includes("image") && (
          <div className="relative w-full max-w-sm rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Upload preview" className="w-full h-auto object-cover max-h-[300px]" />
          </div>
        )}
        {preview && !accept.includes("image") && (
          <div className="text-sm break-all" style={{ color: "var(--text-secondary)" }}>
            Current file: <a href={preview} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{preview}</a>
          </div>
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
