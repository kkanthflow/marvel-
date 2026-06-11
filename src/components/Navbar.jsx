import React from "react";

export default function Navbar({ activeCategory, setActiveCategory, categories }) {
  return (
    <header className="navbar-header">
      {/* Top Left Menu / Hamburger Icon */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button 
          className="menu-hamburger"
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Main Category Links (Centered) */}
      <nav className="navbar-nav">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`navbar-link ${activeCategory === cat.id ? "active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Social Icons (Top Right Corner) */}
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
      </div>
    </header>
  );
}
