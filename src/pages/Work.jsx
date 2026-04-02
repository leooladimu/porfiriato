import "./Work.css";

const Work = () => {
  const projects = [
    {
      id: 1,
      title: "postRabbit",
      description:
        "AI-powered SEO content platform built for local small businesses. Generates keyword-targeted blog posts and landing pages using the Anthropic API — helping businesses in markets like the Hi-Desert get found on Google without hiring an agency. $40/month SaaS.",
      tags: ["Next.js", "PostgreSQL", "Prisma", "Clerk", "Stripe", "Anthropic API"],
      image: "/images/jackrabbit.png",
      link: "https://postrabbit.oleo.dev",
      github: null,
    },
    {
      id: 2,
      title: "geoSync",
      description:
        "A science-grounded relationship compatibility platform built on chronobiology research. Delivers personalized insights and recommendations by analyzing biological rhythms and their effect on interpersonal dynamics.",
      tags: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
      image: "♁",
      link: "https://geosync.oleo.dev/",
      github: "https://github.com/leooladimu/geosync-next",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>My Work</h1>
        <p className="work-intro">
          Products and projects I've built — from commercial SaaS to experimental platforms.
        </p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-icon">
                {project.image.startsWith("/") ? (
                  <img src={project.image} alt={project.title} className="project-icon-img" />
                ) : (
                  project.image
                )}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <div className="project-links">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <button className="view-project-btn">Live Demo</button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <button className="view-project-btn">GitHub</button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
