import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  image: z.string().optional().nullable(),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  issuer: z.string().min(1, "Issuer is required").max(200),
  date: z.string().min(1, "Date is required"),
  imageUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required").max(50),
  url: z.string().url("Invalid URL"),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export const siteSettingsSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  heroHeadline: z.string().min(1).max(300),
  heroSubtext: z.string().max(500),
  aboutText: z.string().max(5000),
  aboutHighlights: z.string().max(2000),
  phone: z.string().max(50),
  email: z.string().email(),
  profilePhoto: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  seoTitle: z.string().max(200),
  seoDescription: z.string().max(500),
  ogImage: z.string().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
