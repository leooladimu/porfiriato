import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kaleidoscope from './components/Kaleidoscope';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Work from './pages/Work';
import './App.css';

function App() {
  return (
    <Router>
      <Kaleidoscope />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/work" element={<Work />} />
      </Routes>
    </Router>
  );
}

export default App;
