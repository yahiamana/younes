import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const targetEmail = process.env.CONTACT_EMAIL || "younes.bnl@yahoo.com";

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: `[Portfolio Contact] ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Message</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: 1px solid #eee;" />
          <div style="padding: 16px 0; white-space: pre-wrap;">${data.message}</div>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">Sent from your portfolio website</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendSecurityAlert(event: {
  type: string;
  severity: string;
  ipAddress: string;
  metadata?: any;
}) {
  const targetEmail = process.env.CONTACT_EMAIL || "younes.bnl@yahoo.com";

  try {
    await transporter.sendMail({
      from: `"Portfolio Security" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: `[SECURITY ALERT] ${event.severity}: ${event.type}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ef4444; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ef4444; color: white; padding: 16px; text-align: center;">
            <h2 style="margin: 0;">Critical Security Event</h2>
          </div>
          <div style="padding: 24px;">
            <p><strong>Event Type:</strong> ${event.type}</p>
            <p><strong>Severity:</strong> <span style="color: #ef4444; font-weight: bold;">${event.severity}</span></p>
            <p><strong>Source IP:</strong> ${event.ipAddress}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
            <p><strong>Metadata:</strong></p>
            <pre style="background: #f4f4f5; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 13px;">${JSON.stringify(event.metadata, null, 2)}</pre>
            <div style="margin-top: 32px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/security" 
                 style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Review in Security Dashboard
              </a>
            </div>
          </div>
          <div style="background-color: #f8fafc; color: #64748b; padding: 12px; text-align: center; font-size: 12px;">
            This is an automated security alert from your Portfolio DevSecOps system.
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send security alert:", error);
    return false;
  }
}
