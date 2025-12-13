import './Work.css';

const Work = () => {
  const projects = [
    {
      id: 1,
      title: 'Ọleoflix',
      description: 'A full-stack streaming platform with user authentication, content browsing, and video playback capabilities.',
      tags: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      image: '📽️',
      link: 'https://frontend-three-alpha-14.vercel.app/',
      github: 'https://github.com/leooladimu/streamingPlatform'
    },
    {
      id: 2,
      title: 'Dodge Game',
      description: 'A fast-paced challenge where players must avoid incoming attacks to survive and score points.',
      tags: ['React', 'Vite'],
      image: '📱',
      link: 'https://dodge-game-lac.vercel.app/',
      github: 'https://github.com/leooladimu/dodgeGame'
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'Interactive data visualization bringing complex information to life.',
      tags: ['D3.js', 'Python', 'AI'],
      image: '📊'
    },
    {
      id: 4,
      title: 'Project Four',
      description: 'E-commerce platform with seamless user experience.',
      tags: ['Next.js', 'Stripe', 'PostgreSQL'],
      image: '🛍️'
    },
    {
      id: 5,
      title: 'Project Five',
      description: 'Generative art installation combining code and creativity.',
      tags: ['Canvas', 'WebGL', 'Creative'],
      image: '✨'
    },
    {
      id: 6,
      title: 'Project Six',
      description: 'Real-time collaboration tool for distributed teams.',
      tags: ['WebSocket', 'React', 'Express'],
      image: '🚀'
    }
  ];

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>My Work</h1>
        <p className="work-intro">
          A selection of projects showcasing my passion for building 
          beautiful, functional digital experiences.
        </p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-icon">{project.image}</div>
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
                {!project.link && !project.github && (
                  <button className="view-project-btn">View Project</button>
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
