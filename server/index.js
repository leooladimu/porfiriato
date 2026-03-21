import express from "express";
import { Resend } from "resend";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  console.log("Received contact form submission:", req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log("Validation failed - missing fields");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    console.log("Sending email via Resend...");

    const fromAddress = process.env.EMAIL_FROM || "Contact Form <onboarding@resend.dev>";

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
      return res.status(500).json({ error: "Failed to send email.", details: error.message });
    }

    console.log("Message sent:", data.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send email.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
