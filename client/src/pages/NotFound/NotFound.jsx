import Head from 'next/head';
import Link from 'next/link';
import styles from './NotFound.module.css';

function LinkBrokenIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Link Expired or Not Found — SnapSL</title>
        <meta name="description" content="This short link has expired or does not exist." />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Icon */}
          <div className={styles.iconWrap}>
            <LinkBrokenIcon />
          </div>

          {/* Code */}
          <div className={styles.code}>410</div>

          {/* Title */}
          <h1 className={styles.title}>Link expired or not found</h1>

          {/* Description */}
          <p className={styles.desc}>
            This short link has either expired after 100 days or never existed.
            Short links on SnapSL are temporary by design.
          </p>

          {/* Info box */}
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>TTL</span>
              <span className={styles.infoValue}>100 days from creation</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Storage</span>
              <span className={styles.infoValue}>Redis auto-expiry</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>Expired / Not found</span>
            </div>
          </div>

          {/* CTA */}
          <Link href="/" className={styles.backBtn}>
            <ArrowLeftIcon />
            Create a new short link
          </Link>
        </div>
      </main>
    </>
  );
}
