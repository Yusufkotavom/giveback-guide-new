// Affiliate Link Management & Tracking Utilities

export interface AffiliateProduct {
  // Core product info
  title: string;
  slug: string;
  price?: string;
  originalPrice?: string;
  imageUrl?: string;
  
  // Affiliate specific
  affiliateCode?: string;
  commissionRate?: string;
  discountCode?: string;
  specialOffer?: string;
  ctaText?: string;
  priority?: string;
  externalRating?: string;
  soldCount?: string;
  isSponsored?: boolean;
  targetAudience?: string[];
  
  // Marketplace URLs
  tokopediaUrl?: string;
  shopeeUrl?: string;
  blibliUrl?: string;
  bukalapakUrl?: string;
  lazadaUrl?: string;
}

export interface AffiliateLink {
  marketplace: string;
  originalUrl: string;
  affiliateUrl: string;
  utmParams: UTMParameters;
  trackingId: string;
}

export interface UTMParameters {
  source: string;      // utm_source (e.g., 'kotacom-id')
  medium: string;      // utm_medium (e.g., 'affiliate', 'blog-embed')
  campaign: string;    // utm_campaign (e.g., 'product-recommendation')
  term?: string;       // utm_term (product category/keywords)
  content?: string;    // utm_content (specific placement/context)
}

export interface TrackingEvent {
  eventType: 'click' | 'view' | 'conversion';
  productSlug: string;
  marketplace: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  referrer?: string;
  placement: string; // 'card', 'embed', 'single-page', 'homepage'
}

// Base configuration for affiliate tracking
export const AFFILIATE_CONFIG = {
  baseSource: 'kotacom-id',
  trackingDomain: 'kotacom.id',
  defaultMedium: 'affiliate',
  campaigns: {
    productCard: 'product-card',
    blogEmbed: 'blog-embed',
    homepage: 'homepage-featured',
    singlePage: 'product-page',
    categoryPage: 'category-listing'
  }
};

// Enhanced marketplace configuration with affiliate support
export const MARKETPLACE_AFFILIATE_CONFIG = {
  tokopedia: {
    name: 'Tokopedia',
    baseParam: 'ta', // Tokopedia affiliate parameter
    color: 'text-white',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    icon: 'tokopedia',
    commission: '2-5%',
    priority: 1
  },
  shopee: {
    name: 'Shopee',
    baseParam: 'af', // Shopee affiliate parameter
    color: 'text-white',
    bgColor: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    icon: 'shopee',
    commission: '1-3%',
    priority: 2
  },
  blibli: {
    name: 'Blibli',
    baseParam: 'ref', // Blibli affiliate parameter
    color: 'text-white',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    icon: 'blibli',
    commission: '2-4%',
    priority: 3
  },
  bukalapak: {
    name: 'Bukalapak',
    baseParam: 'from', // Bukalapak affiliate parameter
    color: 'text-white',
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    icon: 'bukalapak',
    commission: '1-2%',
    priority: 4
  },
  lazada: {
    name: 'Lazada',
    baseParam: 'laz_trackid', // Lazada affiliate parameter
    color: 'text-white',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    icon: 'lazada',
    commission: '2-6%',
    priority: 5
  }
};

/**
 * Generate affiliate tracking URL with UTM parameters
 */
export function generateAffiliateUrl(
  originalUrl: string,
  marketplace: string,
  product: AffiliateProduct,
  placement: string = 'card',
  customParams: Partial<UTMParameters> = {}
): string {
  if (!originalUrl) return '';

  try {
    const url = new URL(originalUrl);
    const config = MARKETPLACE_AFFILIATE_CONFIG[marketplace.toLowerCase()];
    
    if (!config) return originalUrl;

    // Add affiliate code if available
    if (product.affiliateCode) {
      url.searchParams.set(config.baseParam, product.affiliateCode);
    }

    // Generate UTM parameters
    const utmParams: UTMParameters = {
      source: AFFILIATE_CONFIG.baseSource,
      medium: customParams.medium || AFFILIATE_CONFIG.defaultMedium,
      campaign: customParams.campaign || AFFILIATE_CONFIG.campaigns[placement] || placement,
      term: customParams.term || product.targetAudience?.join(',') || '',
      content: customParams.content || `${marketplace}-${product.slug}`,
      ...customParams
    };

    // Add UTM parameters
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(`utm_${key}`, value);
      }
    });

    // Add tracking timestamp
    url.searchParams.set('t', Date.now().toString());

    return url.toString();
  } catch (error) {
    console.warn('Failed to generate affiliate URL:', error);
    return originalUrl;
  }
}

/**
 * Get available marketplaces for a product with affiliate tracking
 */
export function getAffiliateMarketplaces(product: AffiliateProduct, placement: string = 'card'): AffiliateLink[] {
  const marketplaces: AffiliateLink[] = [];
  
  const urlMap = {
    tokopedia: product.tokopediaUrl,
    shopee: product.shopeeUrl,
    blibli: product.blibliUrl,
    bukalapak: product.bukalapakUrl,
    lazada: product.lazadaUrl
  };

  Object.entries(urlMap).forEach(([marketplace, url]) => {
    if (url) {
      const affiliateUrl = generateAffiliateUrl(url, marketplace, product, placement);
      const trackingId = generateTrackingId(product.slug, marketplace, placement);
      
      marketplaces.push({
        marketplace,
        originalUrl: url,
        affiliateUrl,
        utmParams: extractUTMParams(affiliateUrl),
        trackingId
      });
    }
  });

  // Sort by priority
  return marketplaces.sort((a, b) => {
    const priorityA = MARKETPLACE_AFFILIATE_CONFIG[a.marketplace]?.priority || 999;
    const priorityB = MARKETPLACE_AFFILIATE_CONFIG[b.marketplace]?.priority || 999;
    return priorityA - priorityB;
  });
}

/**
 * Generate unique tracking ID for analytics
 */
export function generateTrackingId(productSlug: string, marketplace: string, placement: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${productSlug}-${marketplace}-${placement}-${timestamp}-${random}`;
}

/**
 * Extract UTM parameters from URL
 */
export function extractUTMParams(url: string): UTMParameters {
  try {
    const urlObj = new URL(url);
    return {
      source: urlObj.searchParams.get('utm_source') || '',
      medium: urlObj.searchParams.get('utm_medium') || '',
      campaign: urlObj.searchParams.get('utm_campaign') || '',
      term: urlObj.searchParams.get('utm_term') || '',
      content: urlObj.searchParams.get('utm_content') || ''
    };
  } catch (error) {
    return { source: '', medium: '', campaign: '' };
  }
}

/**
 * Track affiliate event (click, view, conversion)
 */
export function trackAffiliateEvent(event: TrackingEvent): void {
  // In a real implementation, this would send data to analytics service
  // For now, we'll log to console and localStorage for development
  
  const eventData = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  // Console logging for development
  console.log('Affiliate Event:', eventData);

  // Store in localStorage for development tracking
  if (typeof window !== 'undefined') {
    const existingEvents = JSON.parse(localStorage.getItem('affiliate_events') || '[]');
    existingEvents.push(eventData);
    
    // Keep only last 100 events
    if (existingEvents.length > 100) {
      existingEvents.splice(0, existingEvents.length - 100);
    }
    
    localStorage.setItem('affiliate_events', JSON.stringify(existingEvents));
  }

  // TODO: Send to analytics service (Google Analytics, custom endpoint, etc.)
  // sendToAnalytics(eventData);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: string, currentPrice: string): number {
  try {
    const original = parseFloat(originalPrice.replace(/[^\d.-]/g, ''));
    const current = parseFloat(currentPrice.replace(/[^\d.-]/g, ''));
    
    if (original <= current || original === 0) return 0;
    
    return Math.round(((original - current) / original) * 100);
  } catch (error) {
    return 0;
  }
}

/**
 * Format price with currency
 */
export function formatAffiliatePrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined) return '';
  const priceStr = String(price).trim();
  if (!priceStr) return '';

  // Remove any non-numeric characters except separators
  const clean = priceStr.replace(/[^\d.,]/g, '');

  // If it already has separators, just prefix Rp and return
  if (/[.,]/.test(clean) && /\d/.test(clean)) {
    return `Rp ${clean}`;
  }

  const numeric = parseInt(clean, 10);
  if (Number.isNaN(numeric)) return priceStr;

  return `Rp ${numeric.toLocaleString('id-ID')}`;
}

/**
 * Get product priority badge
 */
export function getPriorityBadge(priority: string | undefined): { text: string; class: string } | null {
  if (!priority) return null;

  const badges = {
    'featured': { text: 'Featured', class: 'bg-yellow-500 text-white' },
    'sponsored': { text: 'Sponsored', class: 'bg-blue-500 text-white' },
    'bestseller': { text: 'Best Seller', class: 'bg-green-500 text-white' },
    'new': { text: 'New', class: 'bg-purple-500 text-white' },
    'sale': { text: 'Sale', class: 'bg-red-500 text-white' }
  };

  return badges[priority.toLowerCase()] || null;
}

/**
 * Generate product embed code for blog posts
 */
export function generateProductEmbedCode(product: AffiliateProduct, style: 'card' | 'inline' | 'banner' = 'card'): string {
  const embedId = `product-embed-${product.slug}-${Date.now()}`;
  
  return `<div id="${embedId}" data-product-slug="${product.slug}" data-embed-style="${style}" class="affiliate-product-embed">
    <!-- Product embed will be rendered here by JavaScript -->
  </div>`;
}

/**
 * Client-side function to track clicks (for browser environment)
 */
export function trackClick(productSlug: string, marketplace: string, placement: string): void {
  if (typeof window === 'undefined') return;

  const event: TrackingEvent = {
    eventType: 'click',
    productSlug,
    marketplace,
    placement,
    timestamp: new Date(),
    sessionId: getSessionId(),
    referrer: document.referrer || ''
  };

  trackAffiliateEvent(event);

  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'affiliate_click', {
      product_slug: productSlug,
      marketplace: marketplace,
      placement: placement,
      custom_parameter: `${productSlug}-${marketplace}`
    });
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('affiliate_session_id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('affiliate_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Check if product is sponsored
 */
export function isSponsored(product: AffiliateProduct): boolean {
  return product.isSponsored === true || product.priority === 'sponsored';
}

/**
 * Get CTA text with fallback
 */
export function getCTAText(product: AffiliateProduct, marketplace: string): string {
  if (product.ctaText) return product.ctaText;
  
  const defaultCTAs = {
    tokopedia: 'Beli di Tokopedia',
    shopee: 'Beli di Shopee',
    blibli: 'Beli di Blibli',
    bukalapak: 'Beli di Bukalapak',
    lazada: 'Beli di Lazada'
  };
  
  return defaultCTAs[marketplace.toLowerCase()] || 'Beli Sekarang';
}

export default {
  generateAffiliateUrl,
  getAffiliateMarketplaces,
  trackAffiliateEvent,
  trackClick,
  calculateDiscountPercentage,
  formatAffiliatePrice,
  getPriorityBadge,
  generateProductEmbedCode,
  isSponsored,
  getCTAText
};