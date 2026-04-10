"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCertificate } from "@/app/actions/certificates";

export default function CertificateActions({ certificateId }: { certificateId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteCertificate(certificateId);
    setDeleting(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} disabled={deleting}
          className="px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer"
          style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
          {deleting ? "Deleting..." : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/certificates/${certificateId}/edit`}
        className="px-3 py-1.5 text-xs rounded-lg font-medium"
        style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}>
        Edit
      </Link>
      <button onClick={() => setConfirming(true)}
        className="px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer"
        style={{ color: "var(--text-tertiary)" }}>
        Delete
      </button>
    </div>
  );
}
