import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = 'https://snapsl.sambhavdwivedi.in';
const SITE_NAME = 'SnapSL';
const SITE_TITLE = 'SnapSL — Ultra-fast URL Shortener & QR Generator';
const SITE_DESC = 'Shorten any URL instantly and generate high-quality QR codes. No sign-up, no tracking. Powered by Redis. Links auto-expire after 100 days.';
const OG_IMAGE = `${SITE_URL}/favicon.ico`;
const AUTHOR_NAME = 'Sambhav Dwivedi';
const AUTHOR_URL = 'https://sambhavdwivedi.in';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/sambhavdwivedi';
const AUTHOR_GITHUB = 'https://github.com/sambhavdwivediofficial';
const REPO_URL = 'https://github.com/sambhavdwivediofficial/snapsl';
const UTC_URL = 'https://unitedtechcommunity.in';
const UTC_LOGO = 'https://unitedtechcommunity.in/utc.jpg';
const UTC_DESC = 'United Tech Community (UTC) is an invite-only global tech community founded by Sambhav Dwivedi for AI researchers, engineers, backend developers, ML experts, and data scientists, Growing together through PeerLink and Publicon in Bengaluru, India.';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />

        {/* ── Canonical ── */}
        <link rel="canonical" href={SITE_URL} />

        {/* ── Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />

        {/* ── Primary SEO ── */}
        <meta name="description" content={SITE_DESC} />
        <meta name="keywords" content="url shortener, qr code generator, short link, free url shortener, qr code, link shortener, snapsl, no signup url shortener" />
        <meta name="author" content={AUTHOR_NAME} />
        <meta name="creator" content={AUTHOR_NAME} />
        <meta name="publisher" content={AUTHOR_NAME} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />

        {/* ── Open Graph (Facebook, LinkedIn, WhatsApp, Discord) ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SnapSL — URL Shortener & QR Generator" />
        <meta property="og:locale" content="en_US" />

        {/* ── Twitter / X Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sambhavdwivedi" />
        <meta name="twitter:creator" content="@sambhavdwivedi" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="SnapSL — URL Shortener & QR Generator" />

        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              // WebApplication schema
              {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: SITE_NAME,
                url: SITE_URL,
                description: SITE_DESC,
                applicationCategory: 'UtilitiesApplication',
                operatingSystem: 'Web',
                isAccessibleForFree: true,
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                author: {
                  '@type': 'Person',
                  name: AUTHOR_NAME,
                  url: AUTHOR_URL,
                  sameAs: [AUTHOR_LINKEDIN, AUTHOR_GITHUB],
                },
                creator: {
                  '@type': 'Person',
                  name: AUTHOR_NAME,
                  url: AUTHOR_URL,
                  sameAs: [AUTHOR_LINKEDIN, AUTHOR_GITHUB],
                },
                maintainer: {
                  '@type': 'Person',
                  name: AUTHOR_NAME,
                  url: AUTHOR_URL,
                },
                codeRepository: REPO_URL,
                keywords: 'url shortener, qr code generator, redis, nextjs, fastify',
              },

              // Person schema — Sambhav Dwivedi
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: AUTHOR_NAME,
                url: AUTHOR_URL,
                sameAs: [AUTHOR_LINKEDIN, AUTHOR_GITHUB, UTC_URL],
                jobTitle: 'AI Engineer & Software Engineer & Founder @ UTC',
                worksFor: {
                  '@type': 'Organization',
                  name: 'United Tech Community (UTC)',
                  url: UTC_URL,
                },
                founder: {
                  '@type': 'Organization',
                  name: 'United Tech Community (UTC)',
                  url: UTC_URL,
                },
              },

              // Organization schema — UTC
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'United Tech Community (UTC)',
                alternateName: 'UTC',
                url: UTC_URL,
                logo: UTC_LOGO,
                description: UTC_DESC,
                founder: {
                  '@type': 'Person',
                  name: AUTHOR_NAME,
                  url: AUTHOR_URL,
                  sameAs: [AUTHOR_LINKEDIN, AUTHOR_GITHUB],
                },
                foundingLocation: {
                  '@type': 'Place',
                  name: 'Bengaluru, India',
                },
                sameAs: [UTC_URL],
              },

              // BreadcrumbList
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: SITE_URL,
                  },
                ],
              },
            ]),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}