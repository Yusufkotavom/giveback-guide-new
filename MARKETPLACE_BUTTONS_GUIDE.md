# Marketplace Buttons & Price Display Guide

This feature adds formatted price display and dynamic Indonesian marketplace buttons for products.

## What it does
- Shows price below product titles, formatted as `Rp X.XXX.XXX`
- Renders one random primary CTA button (e.g., "Cek di Shopee")
- Renders up to two secondary icon-only buttons for other available marketplaces

## Supported marketplaces
- Tokopedia, Shopee, Blibli, Bukalapak, Lazada

## Implementation
- Utilities in `src/utils/marketplaceUtils.ts`
  - `getAvailableMarketplaces(props)`
  - `getRandomPrimaryMarketplace(list)`
  - `getSecondaryMarketplaces(list, primary)`
  - `getMarketplaceIcon(name)`
  - `formatPrice(value)`
- Used in `src/components/ProductCard.astro` and `src/layouts/ProductPage.astro`

## Data requirements
Add `pPrice` to the Notion Products database (Rich Text). Provide values like `850000` or `850.000`. Marketplace URL fields are optional and auto-detected.

## Styling
Colors follow marketplace brand hues. You can adjust Tailwind classes in `MARKETPLACE_CONFIG`.