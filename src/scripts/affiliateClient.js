// Client-side affiliate tracking utilities
// This script makes affiliate utilities available globally for tracking

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

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.affiliateUtils.init();
  });
} else {
  window.affiliateUtils.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.affiliateUtils;
}