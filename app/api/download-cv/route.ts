import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!settings || !settings.resumeUrl) {
      return new NextResponse("CV not found", { status: 404 });
    }

    // Fetch the file from Cloudinary (server-side)
    const response = await fetch(settings.resumeUrl);

    if (!response.ok) {
      return new NextResponse("Failed to fetch CV from storage", { status: 500 });
    }

    // Buffer the file completely to avoid Next.js Serverless stream abort bugs
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/pdf",
        "Content-Disposition": 'attachment; filename="Younes_Benali_CV.pdf"',
      },
    });
  } catch (error) {
    console.error("Error downloading CV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
