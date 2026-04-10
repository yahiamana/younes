"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCertificate } from "@/app/actions/certificates";
import ImageUpload from "../../components/ImageUpload";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createCertificate(formData);
    if (result?.error) {
      setError(JSON.stringify(result.error));
      setLoading(false);
    } else {
      router.push("/admin/certificates");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Certificate</h1>
      <form onSubmit={handleSubmit} className="admin-card space-y-5">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label>
          <input name="title" required className="admin-input" placeholder="Certificate title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Issuer</label>
          <input name="issuer" required className="admin-input" placeholder="Issuing organization" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Date</label>
          <input name="date" type="date" required className="admin-input" />
        </div>
        <ImageUpload
          label="Certificate Image (Optional)"
          name="imageUrl"
          folder="portfolio/certificates"
        />
        <ImageUpload
          label="Certificate File/PDF (Optional)"
          name="fileUrl"
          folder="portfolio/certificates"
          accept="application/pdf,image/*"
        />
        <input type="hidden" name="order" value="0" />
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? "Creating..." : "Create Certificate"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
