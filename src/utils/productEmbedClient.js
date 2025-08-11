// Client-side Product Embed Utilities
// This script handles dynamic product embedding and interaction tracking

// Product Embed Manager
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
      rootMargin: '100px 0px', // Load when within 100px of viewport
      threshold: 0.1
    });
  }

  // Register embed placeholder for lazy loading
  registerEmbed(element) {
    if (!this.observer) return;
    
    const slug = element.dataset.productSlug;
    if (!slug) return;

    // Add loading state
    element.classList.add('loading');
    element.innerHTML = `
      <div class="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Loading product...</span>
      </div>
    `;

    this.observer.observe(element);
  }

  // Load embed content (would typically fetch from API)
  async loadEmbed(element) {
    const slug = element.dataset.productSlug;
    const style = element.dataset.embedStyle || 'card';

    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll show a placeholder
      element.innerHTML = this.createEmbedHTML(slug, style);
      element.classList.remove('loading');
      element.classList.add('loaded');

      // Track embed view
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

  // Create embed HTML (simplified version)
  createEmbedHTML(slug, style) {
    // This would normally use real product data
    return `
      <div class="product-embed-placeholder bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
        <div class="text-blue-600 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h4 class="font-semibold text-gray-900 mb-1">Product: ${slug}</h4>
        <p class="text-sm text-gray-600 mb-3">Style: ${style}</p>
        <p class="text-xs text-gray-500">
          Product embed would appear here<br>
          (Requires server-side rendering for full functionality)
        </p>
      </div>
    `;
  }

  // Create error HTML
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

  // Initialize all embeds on the page
  initializeEmbeds() {
    const embeds = document.querySelectorAll('[data-product-slug]');
    embeds.forEach(embed => {
      if (!embed.classList.contains('loaded') && !embed.classList.contains('loading')) {
        this.registerEmbed(embed);
      }
    });
  }

  // Add click tracking to existing embeds
  addClickTracking() {
    document.addEventListener('click', (event) => {
      // Check if clicked element is an affiliate link within an embed
      const link = event.target.closest('a[href*="tokopedia"], a[href*="shopee"], a[href*="blibli"], a[href*="bukalapak"], a[href*="lazada"]');
      if (!link) return;

      const embed = link.closest('[data-product-slug]');
      if (!embed) return;

      const slug = embed.dataset.productSlug;
      const marketplace = this.detectMarketplace(link.href);
      
      if (window.affiliateUtils && slug && marketplace) {
        window.affiliateUtils.trackClick(slug, marketplace, 'blog-embed');
      }
    });
  }

  // Detect marketplace from URL
  detectMarketplace(url) {
    if (url.includes('tokopedia')) return 'tokopedia';
    if (url.includes('shopee')) return 'shopee';
    if (url.includes('blibli')) return 'blibli';
    if (url.includes('bukalapak')) return 'bukalapak';
    if (url.includes('lazada')) return 'lazada';
    return null;
  }
}

// Embed Shortcode Parser
class EmbedShortcodeParser {
  constructor() {
    this.shortcodePattern = /\[product-embed\s+([^\]]+)\]/g;
  }

  // Parse shortcode attributes
  parseAttributes(attrString) {
    const attrs = {};
    const attrPattern = /(\w+)=["']([^"']+)["']/g;
    let match;
    
    while ((match = attrPattern.exec(attrString)) !== null) {
      attrs[match[1]] = match[2];
    }
    
    return attrs;
  }

  // Replace shortcodes with embed elements
  processShortcodes(content) {
    return content.replace(this.shortcodePattern, (match, attrString) => {
      const attrs = this.parseAttributes(attrString);
      const slug = attrs.slug || '';
      const style = attrs.style || 'card';
      const showDescription = attrs.showDescription !== 'false';
      const showMarketplaces = attrs.showMarketplaces || '2';
      
      if (!slug) {
        return '<div class="text-red-500 text-sm">Error: Product slug required</div>';
      }
      
      return `
        <div 
          class="affiliate-product-embed my-6" 
          data-product-slug="${slug}" 
          data-embed-style="${style}"
          data-show-description="${showDescription}"
          data-show-marketplaces="${showMarketplaces}"
        >
          <!-- Embed content will be loaded here -->
        </div>
      `;
    });
  }
}

// Copy-to-clipboard functionality for embed codes
function copyEmbedCode(slug, style = 'card') {
  const embedCode = `[product-embed slug="${slug}" style="${style}"]`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(embedCode).then(() => {
      showNotification('Embed code copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyTextToClipboard(embedCode);
    });
  } else {
    fallbackCopyTextToClipboard(embedCode);
  }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('Embed code copied to clipboard!', 'success');
  } catch (err) {
    showNotification('Failed to copy embed code', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.embed-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `embed-notification fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Enhanced affiliate tracking with more detailed events
function trackDetailedAffiliateEvent(eventType, data) {
  const event = {
    eventType,
    timestamp: new Date(),
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    ...data
  };
  
  // Send to affiliate utils
  if (window.affiliateUtils) {
    window.affiliateUtils.trackAffiliateEvent(event);
  }
  
  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', eventType, {
      event_category: 'affiliate',
      event_label: data.productSlug,
      custom_map: data
    });
  }
  
  // Send to Facebook Pixel if available
  if (typeof fbq !== 'undefined' && eventType === 'click') {
    fbq('track', 'AddToCart', {
      content_ids: [data.productSlug],
      content_type: 'product',
      value: data.price || 0,
      currency: 'IDR'
    });
  }
}

// Initialize when DOM is ready
function initializeProductEmbeds() {
  const embedManager = new ProductEmbedManager();
  const shortcodeParser = new EmbedShortcodeParser();
  
  // Process any shortcodes in existing content
  const contentElements = document.querySelectorAll('.prose, .content, article');
  contentElements.forEach(element => {
    if (element.innerHTML.includes('[product-embed')) {
      element.innerHTML = shortcodeParser.processShortcodes(element.innerHTML);
    }
  });
  
  // Initialize embeds
  embedManager.initializeEmbeds();
  embedManager.addClickTracking();
  
  // Make utilities globally available
  window.productEmbedManager = embedManager;
  window.copyEmbedCode = copyEmbedCode;
  window.trackDetailedAffiliateEvent = trackDetailedAffiliateEvent;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProductEmbeds);
} else {
  initializeProductEmbeds();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ProductEmbedManager,
    EmbedShortcodeParser,
    copyEmbedCode,
    trackDetailedAffiliateEvent,
    initializeProductEmbeds
  };
}