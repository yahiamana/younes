import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent, logAudit } from "@/lib/security/audit";

export async function POST(request: NextRequest) {
  try {
    // Use requireAuth (Defense in Depth)
    const session = await requireAuth();

    // Specific Rate Limiting for API routes
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = await rateLimit(ip, "api");
    if (!rl.success) {
      await logSecurityEvent("RATE_LIMIT_API", "HIGH", { ip, route: "/api/upload" });
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadToCloudinary(file, folder);
    
    // Audit the file upload
    await logAudit(session.userId, "FILE_UPLOAD", "Media", url);

    return Response.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
