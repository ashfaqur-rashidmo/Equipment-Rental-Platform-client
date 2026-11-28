/*
 * ONE sender for the whole website — not one per user.
 *
 * Uses Resend's REST API (fetch), not SMTP. Vercel blocks outbound SMTP
 * ports (465/587), so nodemailer works locally but fails in production.
 * fetch works in both places.
 *
 * Free "onboarding" sender can only email your own Resend account address.
 * Verify your domain in Resend and set EMAIL_FROM to send to everyone.
 */
const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.EMAIL_FROM || "EquipRent <onboarding@resend.dev>";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

/** Send one email. Falls back to terminal output only when no key is set. */
export async function sendEmail({ to, subject, text }: SendEmailInput) {
  if (!apiKey) {
    console.warn("\n========== EMAIL (DEV MODE - NOT REALLY SENT) ==========");
    console.warn("Add RESEND_API_KEY to the environment to send real emails.");
    console.warn("To:", to);
    console.warn("Subject:", subject);
    console.warn("Message:", text);
    console.warn("========================================================\n");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[EMAIL] Failed to send to ${to}: ${response.status} ${detail}`);
    throw new Error(`Email send failed (${response.status}): ${detail}`);
  }

  console.log(`[EMAIL] Verification email sent to ${to}`);
}
