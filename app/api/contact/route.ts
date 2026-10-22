import { Resend } from "resend";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request: Request) {
  const { name, email, message } = await request.json().catch(() => ({}));

  if (!name || !email || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress =
      process.env.EMAIL_FROM || "Contact Form <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      replyTo: email,
      to: process.env.EMAIL_TO as string,
      subject: `Contact from ${name} (${email})`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(String(name))}</p>
        <p><strong>Email:</strong> ${escapeHtml(String(email))}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(String(message)).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Failed to send email.", details: error.message },
        { status: 500 },
      );
    }

    console.log("Message sent:", data?.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json(
      {
        error: "Failed to send email.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
