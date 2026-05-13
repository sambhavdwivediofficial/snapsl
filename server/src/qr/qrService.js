import QRCode from 'qrcode';

const QR_OPTIONS_PNG = {
  errorCorrectionLevel: 'H', // High error correction (30% damage tolerance)
  type: 'png',
  quality: 1,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  width: 512,
};

const QR_OPTIONS_SVG = {
  errorCorrectionLevel: 'H',
  type: 'svg',
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  width: 512,
};

/**
 * Generate QR code as base64 PNG data URL
 * Returns: "data:image/png;base64,..."
 */
async function generateQRPng(url) {
  try {
    const dataUrl = await QRCode.toDataURL(url, QR_OPTIONS_PNG);
    return dataUrl;
  } catch (err) {
    throw new Error(`QR PNG generation failed: ${err.message}`);
  }
}

/**
 * Generate QR code as SVG string
 */
async function generateQRSvg(url) {
  try {
    const svg = await QRCode.toString(url, QR_OPTIONS_SVG);
    return svg;
  } catch (err) {
    throw new Error(`QR SVG generation failed: ${err.message}`);
  }
}

/**
 * Generate QR code as raw PNG Buffer
 */
async function generateQRBuffer(url) {
  try {
    const buffer = await QRCode.toBuffer(url, QR_OPTIONS_PNG);
    return buffer;
  } catch (err) {
    throw new Error(`QR Buffer generation failed: ${err.message}`);
  }
}

export { generateQRPng, generateQRSvg, generateQRBuffer };
