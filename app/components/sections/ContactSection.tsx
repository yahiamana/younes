"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";
import SectionHeading from "../ui/SectionHeading";

interface ContactProps {
  phone: string;
  email: string;
}

export default function ContactSection({ phone, email }: ContactProps) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    null
  );

  return (
    <section
      id="contact"
      className="section-padding relative"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-custom">
        <SectionHeading
          label="Contact"
          title="Let&apos;s Work Together"
          description="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal>
              <div className="card-premium p-6">
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wider mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="card-premium p-6">
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wider mb-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-medium hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.15}>
              <AnimatePresence mode="wait">
                {state?.success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium p-12 text-center"
                  >
                    <div
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                      style={{
                        background: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: "#22c55e" }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p style={{ color: "var(--text-secondary)" }}>
                      Thank you for reaching out. I&apos;ll get back to you
                      soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    action={formAction}
                    className="card-premium p-8 space-y-5"
                  >
                    {state?.error && (
                      <div
                        className="p-4 rounded-lg text-sm"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                        }}
                      >
                        {state.error}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          className="admin-input"
                          placeholder="Your name"
                        />
                        {state?.fieldErrors?.name && (
                          <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                            {state.fieldErrors.name[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          className="admin-input"
                          placeholder="your@email.com"
                        />
                        {state?.fieldErrors?.email && (
                          <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                            {state.fieldErrors.email[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        required
                        className="admin-input"
                        placeholder="What's this about?"
                      />
                      {state?.fieldErrors?.subject && (
                        <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                          {state.fieldErrors.subject[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        className="admin-input resize-none"
                        placeholder="Tell me about your project or idea..."
                      />
                      {state?.fieldErrors?.message && (
                        <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                          {state.fieldErrors.message[0]}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={pending}
                      className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
