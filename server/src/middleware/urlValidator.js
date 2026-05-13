const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const MAX_URL_LENGTH = 2048;

const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^192\.168\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/,
];

function validateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmed = rawUrl.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, error: `URL too long (max ${MAX_URL_LENGTH} chars)` };
  }

  // Auto-add https:// if no protocol given
  let urlToTest = trimmed;
  if (!/^https?:\/\//i.test(urlToTest)) {
    urlToTest = 'https://' + urlToTest;
  }

  let parsed;
  try {
    parsed = new URL(urlToTest);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  if (!parsed.hostname || parsed.hostname.length < 3) {
    return { valid: false, error: 'Invalid hostname' };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(parsed.hostname)) {
      return { valid: false, error: 'Private or local URLs are not allowed' };
    }
  }

  if (!parsed.hostname.includes('.')) {
    return { valid: false, error: 'Invalid hostname' };
  }

  return { valid: true, url: urlToTest };
}

export { validateUrl };