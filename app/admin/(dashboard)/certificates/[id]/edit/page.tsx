import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditCertificateForm from "./EditCertificateForm";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await prisma.certificate.findUnique({ where: { id } });
  if (!certificate) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Certificate</h1>
      <EditCertificateForm certificate={{
        ...certificate,
        date: certificate.date.toISOString().split("T")[0],
      }} />
    </div>
  );
}
