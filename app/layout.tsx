import type { Metadata } from "next";
import Link from "next/link";
import Kaleidoscope from "@/components/Kaleidoscope";
import Navigation from "@/components/Navigation";
import { SITE_URL } from "@/lib/site";
// Imported once at the root: the page stylesheets share selectors (.page-content, fadeIn)
import "../styles/globals.css";
import "../styles/Navigation.css";
import "../styles/Home.css";
import "../styles/About.css";
import "../styles/Work.css";
import "../styles/Contact.css";
import "../styles/WebDevArticle.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg?v=2" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Kaleidoscope />
        <div className="kaleidoscope-scrim" aria-hidden="true" />
        <Navigation />
        <main>{children}</main>
        <footer className="site-footer">
          <p>Leo Ọládimú · Full-Stack &amp; AI Engineer</p>
          <p>
            <Link href="/resources/web-development">Why SEO Matters</Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
