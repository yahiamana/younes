import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

/**
 * Configure DOMPurify with safe defaults.
 * Strip script tags, iframes, object, embed, and dangerous attributes.
 */
const purifyConfig = {
  USE_PROFILES: { html: true }, // allow standard HTML
  FORBID_TAGS: ["script", "style", "iframe", "frame", "object", "embed", "applet", "meta", "base", "link"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "javascript:", "data:"],
  ALLOW_DATA_ATTR: false,
};

/**
 * Strips HTML heavily, only allowing basic tags (e.g. for descriptions/about text)
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return dirty;
  return DOMPurify.sanitize(dirty, purifyConfig) as string;
}

/**
 * Strips absolutely ALL HTML, returning pure text. Useful for titles, names, simple inputs.
 */
export function stripAllHtml(dirty: string): string {
  if (!dirty) return dirty;
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
}

/**
 * A Zod pre-processor to automatically sanitize strings.
 * Usage: 
 *   name: z.preprocess(sanitizeStringRefine, z.string().min(1))
 */
export const sanitizeStringRefine = (val: unknown) => {
  if (typeof val === "string") {
    return stripAllHtml(val.trim());
  }
  return val;
};

/**
 * A Zod pre-processor to sanitize rich text (HTML allowed but sanitized).
 */
export const sanitizeHtmlRefine = (val: unknown) => {
  if (typeof val === "string") {
    return sanitizeHtml(val.trim());
  }
  return val;
};
