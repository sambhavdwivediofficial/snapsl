import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

// SVG Icons (no emoji, no browser icons)
function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change or outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoIcon}><LinkIcon /></span>
          <span className={styles.logoText}>
            Snap<span className={styles.logoAccent}>SL</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={styles.navLink}>Shorten</Link>
          </li>
          <li>
            <Link href="/#how" className={styles.navLink}>How it works</Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            <li>
              <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Shorten
              </Link>
            </li>
            <li>
              <Link href="/#how" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                How it works
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
