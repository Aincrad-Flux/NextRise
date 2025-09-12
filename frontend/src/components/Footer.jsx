import './Footer.css';
import { Link } from 'react-router-dom';
import logoSrc from '../../public/logo.png';

import { useState, useEffect } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();


  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logoSrc} alt="JEB Incubator logo" className="footer-logo-img" width={60} height={60}/>
          </div>
          <div>
            <strong>JEB Incubator</strong>
            <div className="footer-tagline">Accelerating visionary startups</div>
          </div>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home </Link>
          <Link to="/catalog">Catalog </Link>
          <Link to="/news">News </Link>
          <Link to="/events">Events</Link>
        </nav>
        <div className="footer-meta">
          © {year} JEB Incubator. All rights reserved.
          {/* <span className="footer-powered">Powered by Aincrad-Flux</span> */}
        </div>
      </div>
    </footer>
  );
}