import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="content">
      <div className="hero">
        <h1>Leo Ọládimú</h1>
        <p className="subtitle">Developer • Designer • Creator</p>
        <p className="bio">
          Crafting elegant solutions at the intersection of technology and artistry. 
          Passionate about building meaningful experiences that inspire and connect.
        </p>
        <div className="links">
          <Link to="/work">View Work</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <div className="scroll-hint"></div>
    </div>
  );
};

export default Home;
