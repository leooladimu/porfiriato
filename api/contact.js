import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const fromAddress =
      process.env.EMAIL_FROM || "Contact Form <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `Contact from ${name} (${email})`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res
        .status(500)
        .json({ error: "Failed to send email.", details: error.message });
    }

    console.log("Message sent:", data.id);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      error: "Failed to send email.",
      details: error.message,
    });
  }
}
