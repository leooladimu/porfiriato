import { Link } from "react-router-dom";
import "./WebDevArticle.css";

const WebDevArticle = () => {
  return (
    <div className="page-content">
      <div className="page-hero" style={{ textAlign: "center" }}>
        <div className="article-tag">Web Development &amp; SEO</div>
        <h1>Why Web Development Is the Foundation of Your Business's Digital Success</h1>
        <div className="article-hero-meta">
          <span>Leo Ọládimú</span>
          <span className="article-meta-sep">|</span>
          <span>Wonder Valley, CA</span>
          <span className="article-meta-sep">|</span>
          <span>5 min read</span>
        </div>
      </div>

      <div className="article-divider" />

      <div className="article-wrap">
        <article>
          <h2 id="what-it-means">What web development actually means for your business</h2>
          <p>
            In today's competitive online landscape, having a strong digital presence isn't optional — it's essential.
            Whether you're a small local business or a growing enterprise, <strong>web development</strong> plays a
            critical role in how customers find you, trust you, and ultimately choose to work with you. A well-built
            website is far more than a digital business card — it's your hardest-working employee.
          </p>
          <p>
            Many business owners think of web development as simply "building a website." In reality, it encompasses
            everything from the underlying <strong>software architecture</strong> to the user experience your visitors
            encounter every time they land on your page. Good web development means your site loads fast, functions
            flawlessly on mobile devices, and is structured in a way that both users and search engines can easily navigate.
          </p>

          <div className="pull-quote">
            <p>
              When your website is built on a solid technical foundation, every other aspect of your digital strategy
              becomes more effective — including your marketing, branding, and customer communication.
            </p>
          </div>

          <h2 id="seo">The connection between web development and SEO</h2>
          <p>
            Here's something many businesses overlook: great web development and strong <strong>SEO</strong> go hand
            in hand. Search engines like Google don't just look at your content — they evaluate your site's speed,
            code structure, mobile responsiveness, and security. A poorly developed website can actively hurt your
            search rankings, no matter how great your written content is.
          </p>
          <p>
            I build websites with SEO best practices baked in from day one. Clean code, optimized performance, proper
            header structures, and secure HTTPS connections all contribute to better visibility in search results —
            helping local customers in the Hi-Desert and beyond find your business with ease.
          </p>

          <h2 id="custom-software">Custom software solutions that grow with you</h2>
          <p>
            Cookie-cutter website templates can only take you so far. As your business evolves, you need{" "}
            <strong>software solutions</strong> that are flexible enough to scale alongside you. Custom web development
            allows you to build tools, features, and integrations tailored specifically to your workflow and your
            customers' needs — saving you time and money in the long run.
          </p>
          <p>
            From e-commerce functionality to client portals and booking systems, the right web development partner
            can turn your website into a powerful business engine.
          </p>

          <h2 id="why-leo">Why work with me?</h2>
          <p>
            Located in Wonder Valley, CA, I bring personalized service and technical expertise to every
            project. I take the time to understand your goals and deliver web solutions that are beautiful, functional,
            and built to perform.
          </p>
          <p>
            You're not hiring a remote agency that's never heard of the Hi-Desert. You're working with someone who
            knows this community and has a stake in seeing local businesses thrive online.
          </p>
        </article>

        <aside className="article-sidebar">
          <div className="sidebar-card">
            <h3>In this article</h3>
            <ul className="toc-list">
              <li><a href="#what-it-means">What web development means for you</a></li>
              <li><a href="#seo">Web development &amp; SEO</a></li>
              <li><a href="#custom-software">Custom software solutions</a></li>
              <li><a href="#why-leo">Why work with me?</a></li>
            </ul>
          </div>

          <div className="sidebar-cta">
            <h3>Ready to build something great?</h3>
            <p>Based in Twentynine Palms. Serving the Hi-Desert and beyond.</p>
            <Link to="/contact" className="article-btn">Get in touch</Link>
          </div>
        </aside>
      </div>

      <section className="bottom-cta-section">
        <div className="bottom-cta-inner">
          <h2>Let's elevate your online presence.</h2>
          <p>
            Ready to move beyond templates and build something that actually works for your business? Let's talk.
          </p>
          <Link to="/contact" className="article-btn-primary">Contact me today</Link>
        </div>
      </section>
    </div>
  );
};

export default WebDevArticle;
