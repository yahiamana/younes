"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCertificate } from "@/app/actions/certificates";
import ImageUpload from "../../../components/ImageUpload";

interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string | null;
  fileUrl: string | null;
  order: number;
}

export default function EditCertificateForm({ certificate }: { certificate: CertificateData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateCertificate(certificate.id, formData);
    if (result?.error) {
      setError(JSON.stringify(result.error));
      setLoading(false);
    } else {
      router.push("/admin/certificates");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-5">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Title</label>
        <input name="title" required className="admin-input" defaultValue={certificate.title} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Issuer</label>
        <input name="issuer" required className="admin-input" defaultValue={certificate.issuer} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Date</label>
        <input name="date" type="date" required className="admin-input" defaultValue={certificate.date} />
      </div>
      <ImageUpload
        label="Certificate Image"
        name="imageUrl"
        defaultValue={certificate.imageUrl || ""}
        folder="portfolio/certificates"
      />
      <ImageUpload
        label="Certificate File/PDF"
        name="fileUrl"
        defaultValue={certificate.fileUrl || ""}
        folder="portfolio/certificates"
        accept="application/pdf,image/*"
      />
      <input type="hidden" name="order" value={certificate.order} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
