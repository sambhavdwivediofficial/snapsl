import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from './Home.module.css';
import QRDisplay from '../../components/QR/QR';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function QRIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="3" height="3"/>
      <rect x="18" y="14" width="3" height="3"/>
      <rect x="14" y="18" width="3" height="3"/>
      <rect x="18" y="18" width="3" height="3"/>
    </svg>
  );
}

function BothIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

const MODES = [
  { id: 'link', label: 'Short Link', Icon: LinkIcon },
  { id: 'qr',   label: 'QR Code',   Icon: QRIcon   },
  { id: 'both', label: 'Both',       Icon: BothIcon },
];

export default function Home() {
  const [url, setUrl]         = useState('');
  const [mode, setMode]       = useState('link');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);

  const qrRef = useRef(null);

  // Jab QR result aaye, scroll karke QR dikhao
  useEffect(() => {
    if (result?.qr && qrRef.current) {
      // Thoda wait karo animation start hone ke baad scroll karo
      const timer = setTimeout(() => {
        qrRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [result]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), mode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyShortUrl() {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  function reset() {
    setUrl('');
    setResult(null);
    setError('');
    setCopied(false);
  }

  function formatTTL(seconds) {
    if (!seconds || seconds < 0) return 'Expired';
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} remaining`;
  }

  const hasQR = result?.qr;

  return (
    <>
      <Head>
        <title>SnapSL — Ultra-fast URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Shorten any URL instantly. Generate QR codes. No sign-up required. Links expire in 100 days." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              No account required
            </div>
            <h1 className={styles.heading}>
              Shorten.<br />
              <span className={styles.headingDim}>Share. Scan.</span>
            </h1>
            <p className={styles.subheading}>
              Paste any URL and get a minimal shareable link or QR code instantly.
              Links auto-expire after 100 days.
            </p>
          </div>
        </section>

        {/* Card — splits into two columns when QR is present */}
        <section className={`${styles.cardWrap} ${hasQR ? styles.cardWrapSplit : ''}`}>

          {/* Left panel — always visible */}
          <div className={styles.cardLeft}>
            {!result ? (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="url-input">
                    Paste your URL
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><LinkIcon /></span>
                    <input
                      id="url-input"
                      type="url"
                      className={styles.input}
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                      placeholder="https://example.com/page?ref=..."
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  {error && (
                    <p className={styles.errorMsg} role="alert">{error}</p>
                  )}
                </div>

                <div className={styles.modeGroup}>
                  <span className={styles.modeLabel}>What do you need?</span>
                  <div className={styles.modes}>
                    {MODES.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.modeBtn} ${mode === id ? styles.modeActive : ''}`}
                        onClick={() => setMode(id)}
                      >
                        <Icon />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || !url.trim()}
                >
                  {loading ? (
                    <><SpinnerIcon />Generating...</>
                  ) : (
                    <>Generate<ArrowIcon /></>
                  )}
                </button>
              </form>
            ) : (
              <div className={styles.result}>
                <div className={styles.resultHeader}>
                  <span className={styles.resultLabel}>
                    {result.isNew ? 'Generated' : 'Already exists'}
                  </span>
                  <button className={styles.resetBtn} onClick={reset}>
                    New Link
                  </button>
                </div>

                {(mode === 'link' || mode === 'both') && (
                  <div className={styles.shortUrlBox}>
                    <div className={styles.shortUrlRow}>
                      <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shortUrl}
                      >
                        {result.shortUrl}
                        <span className={styles.externalIcon}><ExternalIcon /></span>
                      </a>
                    </div>
                    <div className={styles.shortUrlMeta}>
                      <span className={styles.metaText}>
                        Token: <code className={styles.tokenCode}>/SL/{result.token}</code>
                      </span>
                      <span className={styles.metaText}>
                        {formatTTL(result.expiresIn)}
                      </span>
                    </div>
                    <button
                      className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
                      onClick={copyShortUrl}
                    >
                      {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy Link</>}
                    </button>
                  </div>
                )}

                <div className={styles.originalUrl}>
                  <span className={styles.originalLabel}>Original URL</span>
                  <p className={styles.originalText} title={result.originalUrl}>
                    {result.originalUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — QR, slides in from right */}
          {hasQR && (
            <div className={styles.cardRight} ref={qrRef}>
              <QRDisplay qr={result.qr} shortUrl={result.shortUrl} />
            </div>
          )}
        </section>

        {/* How it works */}
        <section className={styles.how} id="how">
          <h2 className={styles.howTitle}>How it works</h2>
          <div className={styles.steps}>
            {[
              { n: '01', title: 'Paste URL',      desc: 'Drop any long URL into the input field.' },
              { n: '02', title: 'Choose output',  desc: 'Pick short link, QR code, or both at once.' },
              { n: '03', title: 'Get result',     desc: 'Instantly receive your /SL/ link or scannable QR.' },
              { n: '04', title: 'Auto-expires',   desc: 'Redis handles expiry. After 100 days, link is gone.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className={styles.step}>
                <span className={styles.stepNum}>{n}</span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}