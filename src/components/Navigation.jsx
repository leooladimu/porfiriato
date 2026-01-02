import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img 
          src="/images/profile-nav.jpeg" 
          alt="Leo Ọládimú" 
          className="nav-avatar"
        />
        <Link to="/" className="nav-logo">Leo Ọládimú</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/work">View Work</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navigation;
