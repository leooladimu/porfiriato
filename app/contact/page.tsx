import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact | Leo Ọládimú",
  description:
    "Get in touch with Leo Ọládimú about full-time AI and full-stack roles or freelance projects for your small business. Based in Southern California, working remotely.",
  path: "/contact",
});

export default function Contact() {
  return <ContactForm />;
}
