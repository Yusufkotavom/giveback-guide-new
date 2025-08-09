(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/src/utils/marketplaceUtils.ts b/src/utils/marketplaceUtils.ts
--- a/src/utils/marketplaceUtils.ts
+++ b/src/utils/marketplaceUtils.ts
@@ -0,0 +1,137 @@
+// Marketplace button utilities for Indonesian e-commerce platforms
+
+export interface MarketplaceLink {
+  name: string;
+  url: string;
+  color: string;
+  bgColor: string;
+  hoverColor: string;
+  icon: string;
+  ctaText: string;
+}
+
+export interface MarketplaceConfig {
+  tokopedia: MarketplaceLink;
+  shopee: MarketplaceLink;
+  blibli: MarketplaceLink;
+  bukalapak: MarketplaceLink;
+  lazada: MarketplaceLink;
+}
+
+export const MARKETPLACE_CONFIG: MarketplaceConfig = {
+  tokopedia: {
+    name: 'Tokopedia',
+    url: 'pTokopediaURL',
+    color: 'text-white',
+    bgColor: 'bg-green-500',
+    hoverColor: 'hover:bg-green-600',
+    icon: 'tokopedia',
+    ctaText: 'Cek di Tokopedia'
+  },
+  shopee: {
+    name: 'Shopee', 
+    url: 'pShopeeURL',
+    color: 'text-white',
+    bgColor: 'bg-orange-500',
+    hoverColor: 'hover:bg-orange-600',
+    icon: 'shopee',
+    ctaText: 'Cek di Shopee'
+  },
+  blibli: {
+    name: 'Blibli',
+    url: 'pBlibliURL', 
+    color: 'text-white',
+    bgColor: 'bg-blue-500',
+    hoverColor: 'hover:bg-blue-600',
+    icon: 'blibli',
+    ctaText: 'Cek di Blibli'
+  },
+  bukalapak: {
+    name: 'Bukalapak',
+    url: 'pBukalapakURL',
+    color: 'text-white', 
+    bgColor: 'bg-red-500',
+    hoverColor: 'hover:bg-red-600',
+    icon: 'bukalapak',
+    ctaText: 'Cek di Bukalapak'
+  },
+  lazada: {
+    name: 'Lazada',
+    url: 'pLazadaURL',
+    color: 'text-white',
+    bgColor: 'bg-purple-500', 
+    hoverColor: 'hover:bg-purple-600',
+    icon: 'lazada',
+    ctaText: 'Cek di Lazada'
+  }
+};
+
+export function getAvailableMarketplaces(productProperties: any): MarketplaceLink[] {
+  const available: MarketplaceLink[] = [];
+  
+  Object.entries(MARKETPLACE_CONFIG).forEach(([key, config]) => {
+    if (productProperties[config.url]) {
+      available.push({
+        ...config,
+        url: productProperties[config.url]
+      });
+    }
+  });
+  
+  return available;
+}
+
+export function getRandomPrimaryMarketplace(availableMarketplaces: MarketplaceLink[]): MarketplaceLink | null {
+  if (availableMarketplaces.length === 0) return null;
+  
+  const randomIndex = Math.floor(Math.random() * availableMarketplaces.length);
+  return availableMarketplaces[randomIndex];
+}
+
+export function getSecondaryMarketplaces(availableMarketplaces: MarketplaceLink[], primary: MarketplaceLink | null): MarketplaceLink[] {
+  if (!primary) return availableMarketplaces.slice(0, 2);
+  
+  return availableMarketplaces
+    .filter(marketplace => marketplace.name !== primary.name)
+    .slice(0, 2);
+}
+
+export function getMarketplaceIcon(iconName: string): string {
+  const icons: Record<string, string> = {
+    tokopedia: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
+      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
+    </svg>`,
+    shopee: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
+      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
+    </svg>`,
+    blibli: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
+      <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
+    </svg>`,
+    bukalapak: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
+      <path d="M19 7h-1V6a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H8V6z"/>
+    </svg>`,
+    lazada: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
+      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
+    </svg>`
+  };
+  
+  return icons[iconName] || icons.tokopedia;
+}
+
+export function formatPrice(price: string): string {
+  if (!price) return '';
+  
+  // Remove any existing currency symbols and clean the string
+  const cleanPrice = price.replace(/[^\d.,]/g, '');
+  
+  // If it's already formatted or contains decimal points, return as is
+  if (cleanPrice.includes('.') || cleanPrice.includes(',')) {
+    return `Rp ${cleanPrice}`;
+  }
+  
+  // If it's a plain number, format with thousands separator
+  const numericPrice = parseInt(cleanPrice);
+  if (isNaN(numericPrice)) return price;
+  
+  return `Rp ${numericPrice.toLocaleString('id-ID')}`;
+}
EOF
)
