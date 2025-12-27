import './About.css';

const About = () => {
  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>About Me</h1>
        <div className="about-content">
          <div className="about-section">
            <h2>Background</h2>
            <p>
I'm Leo Ọládimú, a developer and designer passionate about creating elegant digital experiences. My work sits at the intersection of technology, art, and human connection.
My path to software engineering has been unconventional. I've lived a life that taught me about resilience, consequence, and the power of second chances—lessons that shape how I approach problem-solving and collaboration. After making the decision to rebuild my life from the ground up, I pursued technical training at MIT and discovered that code offers something I'd been searching for: the ability to create something meaningful that impacts real people.
I bring a perspective most developers don't—I understand what it means to start over, to prove yourself when the odds are stacked against you, and to commit fully to a new direction. That hunger and discipline drive everything I build.
            </p>
          </div>

          <div className="about-section">
            <h2>Skills & Expertise</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <h3>Development</h3>
                <p>  Next.js, TypeScript, MongoDB, Express.js, React.js, Node.js</p>
              </div>
              <div className="skill-card">
                <h3>Design</h3>
                <p>UI/UX, Visual Design, Animation</p>
              </div>
              <div className="skill-card">
                <h3>Creative</h3>
                <p>Generative Art, Interactive Media</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Philosophy</h2>
            <p>
              I believe technology should be both powerful and beautiful. 
              Every project is an opportunity to blend functionality with artistry, 
              creating experiences that resonate on both practical and emotional levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
