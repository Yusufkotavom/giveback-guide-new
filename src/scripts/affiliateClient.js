// Client-side affiliate tracking utilities
// This script makes affiliate utilities available globally for tracking

// Product Embed Manager for dynamic embedding
class ProductEmbedManager {
  constructor() {
    this.embedCache = new Map();
    this.observer = null;
    this.initializeObserver();
  }

  // Initialize intersection observer for lazy loading embeds
  initializeObserver() {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadEmbed(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });
  }

  // Register embed placeholder for lazy loading
  registerEmbed(element) {
    if (!this.observer) return;
    
    const slug = element.dataset.productSlug;
    if (!slug) return;

    element.classList.add('loading');
    element.innerHTML = `
      <div class="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Loading product...</span>
      </div>
    `;

    this.observer.observe(element);
  }

  // Load embed content
  async loadEmbed(element) {
    const slug = element.dataset.productSlug;
    const style = element.dataset.embedStyle || 'card';

    try {
      element.innerHTML = this.createEmbedHTML(slug, style);
      element.classList.remove('loading');
      element.classList.add('loaded');

      if (window.affiliateUtils) {
        window.affiliateUtils.trackView(slug, 'blog-embed');
      }
    } catch (error) {
      console.error('Failed to load embed:', error);
      element.innerHTML = this.createErrorHTML();
      element.classList.remove('loading');
      element.classList.add('error');
    }
  }

  createEmbedHTML(slug, style) {
    return `
      <div class="product-embed-placeholder bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
        <div class="text-blue-600 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 mb-1">Product: ${slug}</h4>
        <p class="text-sm text-gray-600 mb-3">Style: ${style}</p>
        <p class="text-xs text-gray-500">Product embed placeholder</p>
      </div>
    `;
  }

  createErrorHTML() {
    return `
      <div class="product-embed-error bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div class="text-red-500 mb-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-sm text-red-700">Failed to load product</p>
      </div>
    `;
  }

  initializeEmbeds() {
    const embeds = document.querySelectorAll('[data-product-slug]');
    embeds.forEach(embed => {
      if (!embed.classList.contains('loaded') && !embed.classList.contains('loading')) {
        this.registerEmbed(embed);
      }
    });
  }
}

// Initialize affiliate utilities on the client-side
window.affiliateUtils = {
  // Track affiliate click events
  trackClick: function(productSlug, marketplace, placement) {
    try {
      const event = {
        eventType: 'click',
        productSlug: productSlug,
        marketplace: marketplace,
        placement: placement,
        timestamp: new Date(),
        sessionId: this.getSessionId(),
        referrer: document.referrer || '',
        url: window.location.href
      };

      // Log to console for development
      console.log('Affiliate Click:', event);

      // Store in localStorage for development tracking
      this.storeEvent(event);

      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
          product_slug: productSlug,
          marketplace: marketplace,
          placement: placement,
          value: 1
        });
      }

      // Send to Google Tag Manager if available
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'affiliate_click',
          product_slug: productSlug,
          marketplace: marketplace,
          placement: placement,
          timestamp: event.timestamp.toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      return false;
    }
  },

  // Track affiliate view events
  trackView: function(productSlug, placement) {
    try {
      const event = {
        eventType: 'view',
        productSlug: productSlug,
        marketplace: null,
        placement: placement,
        timestamp: new Date(),
        sessionId: this.getSessionId(),
        referrer: document.referrer || '',
        url: window.location.href
      };

      // Log to console for development
      console.log('Affiliate View:', event);

      // Store in localStorage for development tracking
      this.storeEvent(event);

      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_view', {
          product_slug: productSlug,
          placement: placement,
          value: 1
        });
      }

      // Send to Google Tag Manager if available
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'affiliate_view',
          product_slug: productSlug,
          placement: placement,
          timestamp: event.timestamp.toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error tracking affiliate view:', error);
      return false;
    }
  },

  // Get or create session ID
  getSessionId: function() {
    let sessionId = sessionStorage.getItem('affiliate_session_id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      sessionStorage.setItem('affiliate_session_id', sessionId);
    }
    return sessionId;
  },

  // Store event in localStorage for development
  storeEvent: function(event) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('affiliate_events') || '[]');
      existingEvents.push({
        ...event,
        timestamp: event.timestamp.toISOString()
      });
      
      // Keep only last 100 events
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      
      localStorage.setItem('affiliate_events', JSON.stringify(existingEvents));
    } catch (error) {
      console.error('Error storing affiliate event:', error);
    }
  },

  // Get stored events (for debugging)
  getStoredEvents: function() {
    try {
      return JSON.parse(localStorage.getItem('affiliate_events') || '[]');
    } catch (error) {
      console.error('Error retrieving affiliate events:', error);
      return [];
    }
  },

  // Clear stored events
  clearStoredEvents: function() {
    try {
      localStorage.removeItem('affiliate_events');
      console.log('Affiliate events cleared');
    } catch (error) {
      console.error('Error clearing affiliate events:', error);
    }
  },

  // Initialize tracking (called automatically)
  init: function() {
    // Track page load
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }

    // Track scroll depth for affiliate content
    this.initScrollTracking();

    console.log('Affiliate tracking initialized');
  },

  // Initialize scroll depth tracking
  initScrollTracking: function() {
    let scrollDepths = [25, 50, 75, 90];
    let trackedDepths = [];

    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
          trackedDepths.push(depth);
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
              scroll_depth: depth,
              page_location: window.location.href
            });
          }

          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              event: 'scroll_depth',
              scroll_depth: depth,
              page_location: window.location.href
            });
          }
        }
      });
    };

    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(trackScroll, 100);
    });
  },

  // Track conversion (when user completes purchase)
  trackConversion: function(productSlug, marketplace, value, currency = 'IDR') {
    try {
      const event = {
        eventType: 'conversion',
        productSlug: productSlug,
        marketplace: marketplace,
        placement: 'conversion',
        timestamp: new Date(),
        sessionId: this.getSessionId(),
        value: value,
        currency: currency,
        url: window.location.href
      };

      // Log to console for development
      console.log('Affiliate Conversion:', event);

      // Store in localStorage
      this.storeEvent(event);

      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: `${productSlug}-${Date.now()}`,
          value: value,
          currency: currency,
          items: [{
            item_id: productSlug,
            item_name: productSlug,
            category: marketplace,
            quantity: 1,
            price: value
          }]
        });
      }

      // Send to Google Tag Manager if available
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'affiliate_conversion',
          product_slug: productSlug,
          marketplace: marketplace,
          value: value,
          currency: currency,
          timestamp: event.timestamp.toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error tracking affiliate conversion:', error);
      return false;
    }
  }
};

// Initialize product embed manager
function initializeProductEmbeds() {
  const embedManager = new ProductEmbedManager();
  embedManager.initializeEmbeds();
  
  // Make embed manager globally available
  window.productEmbedManager = embedManager;
  
  // Add shortcode support for copy functionality
  window.copyEmbedCode = function(slug, style = 'card') {
    const embedCode = `<ProductEmbed slug="${slug}" style="${style}" />`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embedCode).then(() => {
        console.log('Embed code copied to clipboard!');
      });
    }
  };
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.affiliateUtils.init();
    initializeProductEmbeds();
  });
} else {
  window.affiliateUtils.init();
  initializeProductEmbeds();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.affiliateUtils;
}