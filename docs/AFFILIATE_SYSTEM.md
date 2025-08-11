# Affiliate Product System Documentation

## Overview

The affiliate product system allows you to embed and track affiliate products throughout your website, with comprehensive analytics and conversion tracking. The system supports both Notion-based and MDX-based products with full affiliate link management.

## Components

### 1. ProductEmbed Component

The `ProductEmbed` component allows you to embed affiliate products in blog posts, pages, and other content.

#### Usage

```astro
import ProductEmbed from "../components/ProductEmbed.astro";

<ProductEmbed 
  slug="product-slug"
  style="card"
  showDescription={true}
  showMarketplaces={true}
  maxMarketplaces={2}
  placement="blog-embed"
  className="my-6"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slug` | string | **required** | Product slug to embed |
| `style` | 'card' \| 'inline' \| 'banner' \| 'compact' | 'card' | Display style |
| `showDescription` | boolean | true | Show product description |
| `showMarketplaces` | boolean | true | Show marketplace buttons |
| `maxMarketplaces` | number | 2 | Maximum marketplace buttons to show |
| `placement` | string | 'blog-embed' | Tracking placement identifier |
| `className` | string | '' | Additional CSS classes |

#### Styles

**Card Style** (`style="card"`)
- Full-featured embed with image, description, and marketplace buttons
- Best for: Featured product recommendations
- Size: Medium to large

**Inline Style** (`style="inline"`)
- Horizontal layout with compact information
- Best for: In-content product mentions
- Size: Small to medium

**Banner Style** (`style="banner"`)
- Wide promotional banner with gradient background
- Best for: Featured promotions and special offers
- Size: Large

**Compact Style** (`style="compact"`)
- Minimal design for sidebar or footer
- Best for: Related products, quick references
- Size: Small

### 2. ProductCard Component

Enhanced product card component with affiliate features for product listings.

#### New Features
- Sponsored/priority badges
- Discount percentage display
- External ratings and sold count
- Special offers and discount codes
- Affiliate link tracking

### 3. Affiliate Utilities

Server-side utilities for affiliate link management and data processing.

#### Key Functions

```typescript
import { 
  getAffiliateMarketplaces, 
  formatAffiliatePrice, 
  calculateDiscountPercentage,
  generateAffiliateUrl,
  trackAffiliateEvent 
} from '../utils/affiliateUtils';

// Get affiliate marketplaces with tracking
const marketplaces = getAffiliateMarketplaces(product, 'homepage');

// Format price with currency
const formattedPrice = formatAffiliatePrice('299000');

// Calculate discount percentage
const discount = calculateDiscountPercentage('399000', '299000');

// Generate tracked affiliate URL
const affiliateUrl = generateAffiliateUrl(originalUrl, 'tokopedia', product, 'blog-embed');
```

## Product Schema

### Notion Product Schema

The Notion products collection includes these affiliate-specific fields:

```typescript
// Core Product Information
pTitle: string                    // Product title
pPrice: string                   // Current price
pOriginalPrice: string           // Original price (for discounts)
pDescription: string             // Product description
pImageURL1: string              // Primary product image
pCategory: string[]             // Product categories

// Affiliate Enhancement Fields
pAffiliateCode: string          // Unique affiliate code
pCommissionRate: string         // Commission percentage
pAffiliateProvider: string      // Primary affiliate provider
pDiscountCode: string           // Special discount code
pSpecialOffer: string           // Special offer text
pCTAText: string               // Custom CTA button text
pPriority: string              // Priority level (featured, sponsored, etc.)
pExternalRating: string        // External rating (e.g., 4.5/5)
pSoldCount: string             // Number of items sold
pIsSponsored: boolean          // Sponsored product flag
pTargetAudience: string[]      // Target audience segments

// Marketplace URLs
pTokopediaURL: string          // Tokopedia product URL
pShopeeURL: string             // Shopee product URL
pBlibliURL: string             // Blibli product URL
pBukalapakURL: string          // Bukalapak product URL
pLazadaURL: string             // Lazada product URL
```

## Tracking System

### Client-Side Tracking

The affiliate tracking system automatically tracks:

- **Page Views**: When users view product pages or embeds
- **Clicks**: When users click affiliate links
- **Conversions**: When users complete purchases (requires integration)
- **Scroll Depth**: User engagement with affiliate content

### Analytics Integration

The system integrates with:

- **Google Analytics 4**: Event tracking for affiliate interactions
- **Google Tag Manager**: Custom event data layer
- **Local Storage**: Development and debugging data

### Event Types

```javascript
// Track affiliate click
window.affiliateUtils.trackClick(productSlug, marketplace, placement);

// Track product view
window.affiliateUtils.trackView(productSlug, placement);

// Track conversion (requires custom implementation)
window.affiliateUtils.trackConversion(productSlug, marketplace, value, currency);
```

## Best Practices

### 1. Content Integration

**Do:**
- Integrate products naturally within content
- Provide genuine value and recommendations
- Use appropriate embed styles for context
- Include clear affiliate disclosures

**Don't:**
- Overwhelm content with too many affiliate links
- Use misleading or exaggerated claims
- Hide affiliate relationships from users

### 2. SEO Considerations

- Use `rel="sponsored"` for all affiliate links
- Include proper schema markup for products
- Maintain content quality and relevance
- Balance affiliate content with editorial content

### 3. Performance

- Use lazy loading for product images
- Implement proper caching strategies
- Monitor page load times with embeds
- Optimize images and assets

### 4. Compliance

- Include clear affiliate disclosures
- Follow FTC guidelines for affiliate marketing
- Respect user privacy and data protection
- Maintain transparency about partnerships

## Configuration

### Marketplace Configuration

Edit `src/utils/affiliateUtils.ts` to configure marketplace settings:

```typescript
export const MARKETPLACE_AFFILIATE_CONFIG = {
  tokopedia: {
    name: 'Tokopedia',
    baseParam: 'ta',
    color: 'text-white',
    bgColor: 'bg-green-500',
    commission: '2-5%',
    priority: 1
  },
  // ... other marketplaces
};
```

### Tracking Configuration

Configure tracking settings:

```typescript
export const AFFILIATE_CONFIG = {
  baseSource: 'kotacom-id',
  trackingDomain: 'kotacom.id',
  defaultMedium: 'affiliate',
  campaigns: {
    productCard: 'product-card',
    blogEmbed: 'blog-embed',
    homepage: 'homepage-featured'
  }
};
```

## Development and Testing

### Local Testing

1. Check browser console for tracking events
2. Inspect localStorage for stored events:
   ```javascript
   window.affiliateUtils.getStoredEvents()
   ```
3. Verify affiliate URLs are properly generated
4. Test different embed styles and configurations

### Debugging

- Enable console logging in development
- Use browser developer tools to inspect network requests
- Monitor localStorage for event storage
- Test affiliate link generation and UTM parameters

## Examples

### Blog Post Integration

```mdx
---
title: "Best Tech Products 2025"
---

import ProductEmbed from "../components/ProductEmbed.astro";

# Our Top Tech Recommendations

Here's our carefully curated list of the best tech products:

<ProductEmbed 
  slug="laptop-asus-vivobook"
  style="card"
  placement="blog-featured"
  className="my-8"
/>

For mobile productivity, we recommend:

<ProductEmbed 
  slug="smartphone-samsung-galaxy"
  style="inline"
  showDescription={false}
  maxMarketplaces={1}
  placement="blog-inline"
/>
```

### Homepage Integration

```astro
---
// In your homepage component
import ProductCard from "../components/ProductCard.astro";
import { getCollection } from 'astro:content';

const featuredProducts = await getCollection('products', ({ data }) => 
  data.properties.pPriority === 'featured'
);
---

<section class="featured-products">
  <h2>Featured Products</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {featuredProducts.map((product) => (
      <ProductCard 
        product={product} 
        placement="homepage-featured"
        showFullDescription={true}
      />
    ))}
  </div>
</section>
```

## Troubleshooting

### Common Issues

1. **Product not found**: Verify slug matches exactly in collection
2. **Tracking not working**: Check if affiliateClient.js is loaded
3. **Images not loading**: Verify image URLs and fallback configuration
4. **Affiliate links not generating**: Check marketplace URL configuration

### Support

For technical support or questions about the affiliate system, please refer to the project documentation or contact the development team.

---

*Last updated: January 2025*