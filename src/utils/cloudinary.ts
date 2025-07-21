/**
 * Cloudinary responsive image utilities
 * Transforms Cloudinary URLs to create responsive image sets
 */

/**
 * Global configuration for Cloudinary transformations
 */
export const CLOUDINARY_CONFIG = {
  // Set to false to disable all transformations and use original URLs
  enableTransformations: true,
  
  // You can also disable specific features
  enableResponsiveImages: true,
  enableFormatOptimization: true,
  enableQualityOptimization: true,
} as const;

export interface ResponsiveImageSizes {
  width: number;
  height?: number;
  quality?: number;
}

export interface ResponsiveImageOptions {
  sizes: ResponsiveImageSizes[];
  fallbackWidth?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Default responsive breakpoints based on common screen sizes
 */
export const DEFAULT_RESPONSIVE_SIZES: ResponsiveImageSizes[] = [
  { width: 400 },   // Mobile
  { width: 768 },   // Tablet
  { width: 1024 },  // Desktop
  { width: 1200 },  // Large desktop (original size)
];

/**
 * Transforms a Cloudinary URL to add responsive parameters
 */
export function transformCloudinaryUrl(
  originalUrl: string, 
  width: number, 
  height?: number, 
  quality: number = 85,
  format: string = 'auto'
): string {
  // If transformations are disabled, return original URL
  if (!CLOUDINARY_CONFIG.enableTransformations) {
    return originalUrl;
  }

  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  // Extract the part after '/upload/'
  const uploadIndex = originalUrl.indexOf('/upload/');
  if (uploadIndex === -1) return originalUrl;

  const baseUrl = originalUrl.substring(0, uploadIndex + 8); // Include '/upload/'
  const imagePath = originalUrl.substring(uploadIndex + 8);

  // Build transformation parameters
  const transforms = [];
  
  if (CLOUDINARY_CONFIG.enableResponsiveImages) {
    transforms.push(`w_${width}`);
    if (height) {
      transforms.push(`h_${height}`, 'c_fill', 'g_auto');
    }
  }
  
  if (CLOUDINARY_CONFIG.enableQualityOptimization) {
    transforms.push(`q_${quality}`);
  }
  
  if (CLOUDINARY_CONFIG.enableFormatOptimization) {
    transforms.push(`f_${format}`);
  }

  // If no transforms, return original URL
  if (transforms.length === 0) {
    return originalUrl;
  }

  return `${baseUrl}${transforms.join(',')}/${imagePath}`;
}

/**
 * Generates a srcset string for responsive images
 */
export function generateSrcSet(
  originalUrl: string, 
  sizes: ResponsiveImageSizes[] = DEFAULT_RESPONSIVE_SIZES,
  options: { quality?: number; format?: string; maintainAspectRatio?: boolean } = {}
): string {
  // If responsive images are disabled, return single original URL
  if (!CLOUDINARY_CONFIG.enableResponsiveImages) {
    return `${originalUrl} 1200w`;
  }

  const { quality = 85, format = 'auto', maintainAspectRatio = true } = options;
  
  return sizes
    .map(size => {
      const height = maintainAspectRatio && size.width ? Math.round(size.width * (800 / 1200)) : size.height;
      const url = transformCloudinaryUrl(originalUrl, size.width, height, quality, format);
      return `${url} ${size.width}w`;
    })
    .join(', ');
}

/**
 * Generates the sizes attribute for responsive images
 */
export function generateSizesAttribute(breakpoints?: string[]): string {
  const defaultBreakpoints = [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 100vw', 
    '(max-width: 1024px) 50vw',
    '33vw'
  ];
  
  return (breakpoints || defaultBreakpoints).join(', ');
}

/**
 * Complete responsive image data for easy use in components
 */
export interface ResponsiveImageData {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

/**
 * Generates complete responsive image data
 */
export function createResponsiveImage(
  originalUrl: string,
  options: {
    sizes?: ResponsiveImageSizes[];
    sizesAttribute?: string[];
    quality?: number;
    format?: string;
    fallbackWidth?: number;
    maintainAspectRatio?: boolean;
  } = {}
): ResponsiveImageData {
  const {
    sizes = DEFAULT_RESPONSIVE_SIZES,
    sizesAttribute,
    quality = 85,
    format = 'auto',
    fallbackWidth = 1200,
    maintainAspectRatio = true
  } = options;

  const fallbackHeight = maintainAspectRatio ? Math.round(fallbackWidth * (800 / 1200)) : undefined;

  return {
    src: transformCloudinaryUrl(originalUrl, fallbackWidth, fallbackHeight, quality, format),
    srcset: generateSrcSet(originalUrl, sizes, { quality, format, maintainAspectRatio }),
    sizes: generateSizesAttribute(sizesAttribute),
    width: fallbackWidth,
    height: fallbackHeight || 800
  };
}

/**
 * Predefined responsive image configurations for common use cases
 */
export const RESPONSIVE_PRESETS = {
  // For hero/featured images (full width)
  hero: {
    sizes: [
      { width: 640 },   // Mobile
      { width: 768 },   // Tablet
      { width: 1024 },  // Desktop
      { width: 1200 },  // Large desktop
      { width: 1600 }   // Extra large
    ],
    sizesAttribute: [
      "(max-width: 640px) 100vw",
      "(max-width: 768px) 100vw", 
      "(max-width: 1024px) 100vw",
      "100vw"
    ]
  },
  
  // For card images (grid layouts)
  card: {
    sizes: [
      { width: 300 },   // Mobile (1 column)
      { width: 400 },   // Tablet (2 columns)
      { width: 600 }    // Desktop (3 columns)
    ],
    sizesAttribute: [
      "(max-width: 640px) 100vw",
      "(max-width: 768px) 50vw", 
      "33vw"
    ]
  },
  
  // For thumbnail images
  thumbnail: {
    sizes: [
      { width: 150 },
      { width: 200 },
      { width: 300 }
    ],
    sizesAttribute: [
      "(max-width: 768px) 150px",
      "200px"
    ]
  },
  
  // For profile/avatar images
  avatar: {
    sizes: [
      { width: 64 },
      { width: 128 },
      { width: 200 }
    ],
    sizesAttribute: [
      "(max-width: 768px) 64px",
      "128px"
    ]
  }
} as const;
