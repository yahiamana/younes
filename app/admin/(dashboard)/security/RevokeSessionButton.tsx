"use client";

import { useTransition } from "react";
import { revokeActiveSession } from "@/app/actions/security";

export function RevokeSessionButton({ sessionId }: { sessionId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    if (confirm("Are you sure you want to revoke this session? The device will be instantly logged out.")) {
      startTransition(async () => {
        const res = await revokeActiveSession(sessionId);
        if (res.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleRevoke}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
        isPending
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      }`}
    >
      {isPending ? "Revoking..." : "Revoke"}
    </button>
  );
}
