const DEFAULT_IMAGE_ENDPOINT = 'https://ik.imagekit.io/w3j9bng8g/';
export const DEFAULT_FALLBACK_IMAGE = '/assets/product-default.png';

/**
 * Builds an optimized ImageKit CDN URL with responsive transformations.
 *
 * @param {string} source - ImageKit URL, relative path, or local fallback
 * @param {object} options - Transformation options
 * @param {number} [options.width] - Desired width in pixels
 * @param {number} [options.height] - Desired height in pixels
 * @param {number} [options.quality=80] - Image quality (1-100)
 * @param {string} [options.format='auto'] - Output format ('auto', 'webp', 'jpg', etc.)
 * @param {string} [options.crop] - Crop strategy (e.g. 'maintain_ratio', 'pad_resize')
 * @param {number} [options.dpr] - Device pixel ratio
 * @returns {string} Fully qualified transformed ImageKit URL or fallback
 */
export const getImageUrl = (source, options = {}) => {
  if (!source || typeof source !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const trimmed = source.trim();
  if (!trimmed) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // If local asset or inline data URL, return as-is
  if (
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const baseEndpoint = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGEKIT_URL_ENDPOINT) ||
    DEFAULT_IMAGE_ENDPOINT
  ).replace(/\/+$/, '');

  const endpointId = baseEndpoint.split('/').filter(Boolean).pop();

  // Extract the clean image path without previous transformations
  let imagePath = trimmed;

  if (imagePath.startsWith(baseEndpoint)) {
    imagePath = imagePath.slice(baseEndpoint.length);
  } else if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const parsed = new URL(imagePath);
      if (parsed.hostname.includes('imagekit.io')) {
        let p = parsed.pathname;
        if (endpointId && p.startsWith(`/${endpointId}`)) {
          p = p.slice(`/${endpointId}`.length);
        }
        imagePath = p;
      } else {
        // External non-ImageKit URL - return as is or fallback
        return trimmed;
      }
    } catch {
      return trimmed;
    }
  }

  // Remove any query params and existing /tr:.../ segments
  imagePath = imagePath.split('?')[0];
  imagePath = imagePath.replace(/\/tr:[^/]+/g, '');
  imagePath = imagePath.replace(/^\/+/, '');

  if (!imagePath) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Build transformations
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    crop,
    dpr
  } = options;

  const transforms = [];

  // Format & Quality optimization by default
  if (format) {
    transforms.push(`f-${format}`);
  }
  if (quality) {
    transforms.push(`q-${quality}`);
  }
  if (width) {
    transforms.push(`w-${Math.round(width)}`);
  }
  if (height) {
    transforms.push(`h-${Math.round(height)}`);
  }
  if (crop) {
    transforms.push(`c-${crop}`);
  }
  if (dpr) {
    transforms.push(`dpr-${dpr}`);
  }

  const trString = transforms.length > 0 ? `tr:${transforms.join(',')}` : '';

  if (trString) {
    return `${baseEndpoint}/${trString}/${imagePath}`;
  }

  return `${baseEndpoint}/${imagePath}`;
};

/**
 * Optimized presets for standard UI surfaces
 */
export const getProductCardImage = (image) =>
  getImageUrl(image, { width: 600, quality: 80, format: 'auto' });

export const getProductDetailImage = (image) =>
  getImageUrl(image, { width: 900, quality: 85, format: 'auto' });

export const getLightboxImage = (image) =>
  getImageUrl(image, { width: 1400, quality: 85, format: 'auto' });

export const getThumbnailImage = (image) =>
  getImageUrl(image, { width: 240, quality: 80, format: 'auto' });
