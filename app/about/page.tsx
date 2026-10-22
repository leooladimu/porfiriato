import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About | Leo Ọládimú",
  description:
    "Leo Ọládimú is a full-stack and AI engineer who trained at MIT, builds production SaaS with Next.js, TypeScript and the Anthropic API, and works with small businesses.",
  path: "/about",
});

export default function About() {
  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>About Me</h1>

        <div className="about-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/profile-about.jpeg"
            alt="Leo Ọládimú"
            className="about-photo"
            loading="lazy"
          />
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Background</h2>
            <p>
              I&apos;m Leo Ọládimú, a full-stack and AI engineer who builds
              production SaaS and AI features, from the database to the
              interface. I work with small businesses and teams who need
              software that holds up under real use. My path to
              software engineering has been unconventional. I&apos;ve lived a life
              that taught me about resilience, consequence, and the power of
              second chances—lessons that shape how I approach problem-solving
              and collaboration. After making the decision to rebuild my life
              from the ground up, I pursued technical training at MIT and
              discovered that code offers something I&apos;d been searching for: the
              ability to create something meaningful that impacts real people. I
              bring a perspective most developers don&apos;t—I understand what it
              means to start over, to prove yourself when the odds are stacked
              against you, and to commit fully to a new direction. That hunger
              and discipline drive everything I build.
            </p>
          </div>

          <div className="about-section">
            <h2>Skills &amp; Expertise</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <h3>Full-Stack</h3>
                <p>Next.js, React, TypeScript, Node, PostgreSQL, Prisma</p>
              </div>
              <div className="skill-card">
                <h3>AI Engineering</h3>
                <p>Anthropic API, validation, retries, cost controls</p>
              </div>
              <div className="skill-card">
                <h3>Product &amp; Delivery</h3>
                <p>Clerk, Stripe, Vercel, Fly, React Native / Expo</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Philosophy</h2>
            <p>
              I believe technology should be both powerful and beautiful. Every
              project is an opportunity to blend functionality with artistry,
              creating experiences that resonate on both practical and emotional
              levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
