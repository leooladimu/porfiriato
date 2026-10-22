import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  POSTRABBIT_URL,
  SITE_URL,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "Leo Ọládimú | Full-Stack & AI Engineer",
  description:
    "Leo Ọládimú is a full-stack and AI engineer building production SaaS and Anthropic API features with Next.js and TypeScript, for teams and small businesses.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Leo Ọládimú",
      alternateName: ["Leo Oladimu"],
      jobTitle: "Full-Stack & AI Engineer",
      url: SITE_URL,
      email: EMAIL,
      image: `${SITE_URL}/images/profile-about.jpeg`,
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Prisma",
        "Clerk",
        "Stripe",
        "Anthropic API",
        "AI engineering",
        "Search engine optimization",
      ],
      sameAs: [LINKEDIN_URL, GITHUB_URL, POSTRABBIT_URL],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "oleo.dev",
      url: SITE_URL,
      image: `${SITE_URL}/og-image.png`,
      description:
        "Freelance full-stack web development and AI feature engineering for small businesses and teams.",
      email: EMAIL,
      founder: { "@id": `${SITE_URL}/#person` },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Southern California" },
        { "@type": "Place", name: "Remote" },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="hero">
        <h1>Leo Ọládimú</h1>
        <p className="subtitle">Full-Stack &amp; AI Engineer</p>
        <p className="bio">
          I build production SaaS and AI features that work on the thousandth
          request, not just the demo. Next.js · TypeScript · Anthropic API.
        </p>
        <div className="links">
          <Link href="/work" className="primary">
            See my work
          </Link>
          <Link href="/contact">Work with me</Link>
        </div>
        <Link href="/resources/web-development" className="secondary-link">
          Why SEO Matters
        </Link>
      </div>
      <div className="scroll-hint"></div>
    </div>
  );
}
