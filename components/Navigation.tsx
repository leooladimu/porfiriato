import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img
          src="/images/profile-nav.jpeg"
          alt="Leo Ọládimú"
          className="nav-avatar"
        />
        <Link href="/" className="nav-logo">
          Leo Ọládimú
        </Link>
      </div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navigation;
