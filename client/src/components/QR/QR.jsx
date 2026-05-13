import { useState } from 'react';
import styles from './QR.module.css';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

/**
 * QR Component
 * Props:
 *   qr: { png: string (data URL), svg: string }
 *   shortUrl: string
 */
export default function QRDisplay({ qr, shortUrl }) {
  const [format, setFormat] = useState('png'); // 'png' | 'svg'
  const [copied, setCopied] = useState(false);

  if (!qr) return null;

  // Download PNG
  function downloadPng() {
    const link = document.createElement('a');
    link.href = qr.png;
    link.download = `snapsl-qr-${shortUrl.split('/').pop()}.png`;
    link.click();
  }

  // Download SVG
  function downloadSvg() {
    const blob = new Blob([qr.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapsl-qr-${shortUrl.split('/').pop()}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleDownload() {
    if (format === 'png') downloadPng();
    else downloadSvg();
  }

  // Copy SVG to clipboard
  async function copySvg() {
    try {
      await navigator.clipboard.writeText(qr.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>QR Code</span>
        {/* Format toggle */}
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${format === 'png' ? styles.active : ''}`}
            onClick={() => setFormat('png')}
          >
            <ImageIcon /> PNG
          </button>
          <button
            className={`${styles.toggleBtn} ${format === 'svg' ? styles.active : ''}`}
            onClick={() => setFormat('svg')}
          >
            <CodeIcon /> SVG
          </button>
        </div>
      </div>

      {/* QR Preview */}
      <div className={styles.preview}>
        {format === 'png' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={qr.png}
            alt={`QR code for ${shortUrl}`}
            className={styles.qrImage}
            width={200}
            height={200}
          />
        ) : (
          <div
            className={styles.svgContainer}
            dangerouslySetInnerHTML={{ __html: qr.svg }}
          />
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          <DownloadIcon />
          Download {format.toUpperCase()}
        </button>

        {format === 'svg' && (
          <button className={styles.copyBtn} onClick={copySvg}>
            {copied ? 'Copied!' : 'Copy SVG'}
          </button>
        )}
      </div>

      <p className={styles.hint}>
        Scan to open{' '}
        <span className={styles.urlHint}>{shortUrl}</span>
      </p>
    </div>
  );
}
