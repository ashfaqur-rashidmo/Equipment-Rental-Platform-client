import nodemailer from "nodemailer";

/*
 * ONE sender for the whole website — not one per user.
 *
 * Every user who registers receives the verification email from this single
 * account. Users never touch .env.
 *
 * Resend is used because it needs only one API key (no Gmail App Password).
 * With the free "onboarding" address you can send to the email you signed up
 * with. Later, verify your own domain in Resend and set EMAIL_FROM to
 * "EquipRent <no-reply@yourdomain.com>".
 */
const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.EMAIL_FROM || "EquipRent <onboarding@resend.dev>";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: apiKey,
  },
});

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

/** Send one email. Falls back to terminal output only when no key is set. */
export async function sendEmail({ to, subject, text }: SendEmailInput) {
  if (!apiKey) {
    console.warn("\n========== EMAIL (DEV MODE - NOT REALLY SENT) ==========");
    console.warn("Add RESEND_API_KEY to .env to send real emails.");
    console.warn("To:", to);
    console.warn("Subject:", subject);
    console.warn("Message:", text);
    console.warn("========================================================\n");
    return;
  }

  try {
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
    });
    console.log(`[EMAIL] Verification email sent to ${to}`);
  } catch (error) {
    console.error(`[EMAIL] Could not send to ${to}:`, error);
    throw error;
  }
}
