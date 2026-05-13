import styles from './Footer.module.css';

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <LinkIcon />
            <span>SnapSL</span>
          </div>
          <p className={styles.brandDesc}>
            Ultra-fast URL shortener. No accounts. No tracking. Just links.
          </p>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <ClockIcon />
            <span>Links expire in 100 days</span>
          </div>
          <div className={styles.feature}>
            <ShieldIcon />
            <span>No auth required</span>
          </div>
          <div className={styles.feature}>
            <ZapIcon />
            <span>Redis-powered speed</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span className={styles.copyright}>
          &copy; {year} SnapSL. All links auto-expire after 100 days.
        </span>
        <span className={styles.built}>
          Built with Fastify &amp; Next.js
        </span>
      </div>
    </footer>
  );
}
