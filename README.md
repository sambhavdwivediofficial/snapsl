<div align="center">
  
# SnapSL

**Ultra-fast URL Shortener & QR Code Generator**

[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-black?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/Fastify-4-black?style=flat-square&logo=fastify)](https://fastify.dev)
[![Redis](https://img.shields.io/badge/Redis-7-black?style=flat-square&logo=redis)](https://redis.io)
[![Node.js](https://img.shields.io/badge/Node.js-20+-black?style=flat-square&logo=nodedotjs)](https://nodejs.org)

Shorten any URL. Generate QR codes. No account. No tracking. Links auto-expire in 100 days.

[Report Bug](https://github.com/sambhavdwivediofficial/snapsl/issues) · [GitHub](https://github.com/sambhavdwivediofficial/snapsl)

</div>

---

## What is SnapSL

SnapSL is a production-ready, minimal URL shortening platform. Paste any URL, choose what you need — a short link, a QR code, or both — and get your result instantly. Zero sign-up. Zero tracking. Built for speed.

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                        SnapSL                           │
├──────────────────────┬──────────────────────────────────┤
│  Short Link          │  QR Code                         │
│  ─────────────────   │  ──────────────────────────────  │
│  • /SL/a format      │  • Always encodes original URL   │
│  • Max 5 chars       │  • PNG + SVG output              │
│  • Auto-expires      │  • Download button               │
│  • Duplicate-safe    │  • Permanent (no expiry)         │
│  • Redis TTL 100d    │  • High error correction (H)     │
└──────────────────────┴──────────────────────────────────┘
```

| Feature | Detail |
|---------|--------|
| Short link format | `/SL/a` → `/SL/zzzzz` (max 5 chars) |
| Characters allowed | `a-z`, `0-9`, hyphen |
| Token allocation | Deterministic base-36, shortest-first |
| Duplicate detection | Reverse mapping — same URL always same token |
| Link expiry | Redis TTL — auto-deleted after 100 days |
| QR encoding | Always the original URL, never the short link |
| QR formats | PNG (512×512) + SVG, both downloadable |
| Auth required | None |
| Database | None — Redis only |
| Rate limiting | 30 requests / 60 seconds per IP |

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        Architecture                         │
│                                                             │
│   Browser                                                   │
│     │                                                       │
│     ▼                                                       │
│  ┌───────────────────────┐                                  │
│  │   Next.js (Client)    │                                  │
│  │   React + CSS Modules │                                  │
│  │   Space Mono + DM Sans│                                  │
│  └──────────┬────────────┘                                  │
│             │  HTTP / Next.js                               │
│             ▼                                               │
│  ┌──────────────────────┐                                   │
│  │  Fastify (Server)    │                                   │
│  │  Node.js ESM         │                                   │
│  │  Rate Limiting + CORS│                                   │
│  └──────────┬───────────┘                                   │
│             │                                               │
│     ┌───────┴────────┐                                      │
│     ▼                ▼                                      │
│  ┌────────┐   ┌─────────────┐                               │
│  │ Redis  │   │  node-qrcode│                               │
│  │ TTL    │   │  PNG + SVG  │                               │
│  └────────┘   └─────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React 18 | SSR, routing, UI |
| Backend | Fastify 4, Node.js 20 | API server, redirect handler |
| Storage | Redis 7 | URL mappings, TTL expiry |
| QR Engine | node-qrcode | PNG + SVG generation |

---

## Token Allocation Engine

The allocator assigns the **shortest available token** deterministically — no UUIDs, no random hashes.

```
Priority sequence (base-36 encoding):

Step 1 — Single alpha      a, b, c ... z                    (26 tokens)
Step 2 — Single digit      0, 1, 2 ... 9                    (10 tokens)
Step 3 — Two alpha         aa, ab, ac ... zz                (676 tokens)
Step 4 — Two digit         00, 01, 02 ... 99                (100 tokens)
Step 5 — Two mixed         a0, a1 ... z9                    (520 tokens)
Step 6 — Three alpha       aaa, aab ... zzz               (17,576 tokens)
  ...continues to max length 5...

Total capacity before 5-char limit: 60,000,000+ unique tokens
```

**How it works:**

```
New request arrives
        │
        ▼
Check reverse map: url_hash → token
        │
   ┌────┴────┐
exists?      not found
   │              │
   ▼              ▼
Return       INCR counter
existing     map to token
token        check if free
             store & return
```

**Redis schema:**

```
sl:s2l:{token}    →  original URL        (TTL: 100 days)
sl:l2s:{hash}     →  token               (TTL: 100 days)
sl:used_tokens    →  Set of active tokens
sl:alloc:counter  →  Integer counter
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Redis 7+

**Install Redis without Docker:**

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu / Debian
sudo apt install redis-server
sudo systemctl start redis

# Windows
# Use WSL2 with Ubuntu, then follow Linux steps above
```

**Or with Docker (one command):**

```bash
docker run -d -p 6379:6379 redis:7-alpine
```
---

## API Reference

### `POST /api/shorten`

```json
{
  "url": "https://example.com/very/long/url",
  "mode": "link" | "qr" | "both"
}
```

**Response — mode: link**
```json
{
  "success": true,
  "shortUrl": "https://yourdomain.com/SL/a",
  "token": "a",
  "originalUrl": "https://example.com/very/long/url",
  "isNew": true,
  "expiresIn": 8640000,
  "expiresAt": "2025-08-19T00:00:00.000Z"
}
```

**Response — mode: qr**
```json
{
  "success": true,
  "originalUrl": "https://example.com/very/long/url",
  "qr": {
    "png": "data:image/png;base64,...",
    "svg": "<svg>...</svg>"
  }
}
```

### `GET /SL/:token`

Redirects `302` to original URL. Returns `410 Gone` if expired or not found.

### `GET /api/info/:token`

Returns token metadata — original URL, TTL remaining, expiry date.

---

## QR Code Behavior

| Mode | Short Link | QR encodes |
|------|-----------|------------|
| `link` | Created | Not created |
| `qr` | Not created | Original URL |
| `both` | Created | Original URL |

QR codes **always encode the original URL** — not the short link. This ensures the QR remains valid even after the short link expires.

---

## Security

- URL validation — only `http://` and `https://` allowed
- Private IP blocking — `localhost`, `127.x`, `192.168.x`, `10.x`, `172.16-31.x` blocked
- Rate limiting — 30 requests per minute per IP
- No user data stored — only URL mappings
- Redis TTL — automatic cleanup, no orphaned data

---

## License

All Rights Reserved © 2026 Sambhav Dwivedi

See [LICENSE](./LICENSE) for full terms.

---

**Author** — [Sambhav Dwivedi](https://sambhavdwivedi.in) · [LinkedIn](https://www.linkedin.com/in/sambhavdwivedi) · [GitHub](https://github.com/sambhavdwivediofficial)

---

<div align="center">

### Built with

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/Fastify-4-black?style=flat-square&logo=fastify)](https://fastify.dev)
[![Redis](https://img.shields.io/badge/Redis-7-black?style=flat-square&logo=redis)](https://redis.io)
[![Node.js](https://img.shields.io/badge/Node.js-20+-black?style=flat-square&logo=nodedotjs)](https://nodejs.org)

</div>