// Marketplace button utilities for Indonesian e-commerce platforms

export interface MarketplaceLink {
  name: string;
  url: string; // final href
  color: string;
  bgColor: string;
  hoverColor: string;
  icon: string; // key name for icon lookup
  ctaText: string; // e.g., "Cek di Shopee"
}

export interface MarketplaceConfigEntry {
  name: string;
  propertyKey: string; // key in properties object, e.g., 'pTokopediaURL'
  color: string;
  bgColor: string;
  hoverColor: string;
  icon: string;
  ctaText: string;
}

export const MARKETPLACE_CONFIG: Record<string, MarketplaceConfigEntry> = {
  tokopedia: {
    name: 'Tokopedia',
    propertyKey: 'pTokopediaURL',
    color: 'text-white',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    icon: 'tokopedia',
    ctaText: 'Cek di Tokopedia'
  },
  shopee: {
    name: 'Shopee',
    propertyKey: 'pShopeeURL',
    color: 'text-white',
    bgColor: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    icon: 'shopee',
    ctaText: 'Cek di Shopee'
  },
  blibli: {
    name: 'Blibli',
    propertyKey: 'pBlibliURL',
    color: 'text-white',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    icon: 'blibli',
    ctaText: 'Cek di Blibli'
  },
  bukalapak: {
    name: 'Bukalapak',
    propertyKey: 'pBukalapakURL',
    color: 'text-white',
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    icon: 'bukalapak',
    ctaText: 'Cek di Bukalapak'
  },
  lazada: {
    name: 'Lazada',
    propertyKey: 'pLazadaURL',
    color: 'text-white',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    icon: 'lazada',
    ctaText: 'Cek di Lazada'
  }
};

export function getAvailableMarketplaces(productProperties: Record<string, any>): MarketplaceLink[] {
  const available: MarketplaceLink[] = [];

  for (const entry of Object.values(MARKETPLACE_CONFIG)) {
    const href = productProperties?.[entry.propertyKey];
    if (href) {
      available.push({
        name: entry.name,
        url: href,
        color: entry.color,
        bgColor: entry.bgColor,
        hoverColor: entry.hoverColor,
        icon: entry.icon,
        ctaText: entry.ctaText,
      });
    }
  }

  return available;
}

export function getRandomPrimaryMarketplace(availableMarketplaces: MarketplaceLink[]): MarketplaceLink | null {
  if (!availableMarketplaces || availableMarketplaces.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableMarketplaces.length);
  return availableMarketplaces[randomIndex];
}

export function getSecondaryMarketplaces(
  availableMarketplaces: MarketplaceLink[],
  primary: MarketplaceLink | null
): MarketplaceLink[] {
  if (!availableMarketplaces || availableMarketplaces.length === 0) return [];
  const filtered = primary
    ? availableMarketplaces.filter((m) => m.name !== primary.name)
    : availableMarketplaces.slice();
  return filtered.slice(0, 2);
}

export function getMarketplaceIcon(iconName: string): string {
  const icons: Record<string, string> = {
    tokopedia: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    shopee: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    blibli: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM1 2v2h2l3.6 7.59-1.35 2.45a2 2 0 0 0-.25.96 2 2 0 0 0 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21L4.27 2H1Zm16 16a2 2 0 1 1 .001-4.001A2 2 0 0 1 17 18Z"/></svg>`,
    bukalapak: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 7h-1V6a4 4 0 0 0-4-4H10A4 4 0 0 0 6 6v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1ZM8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H8V6Z"/></svg>`,
    lazada: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22Z"/></svg>`,
  };

  return icons[iconName] || icons.tokopedia;
}

export function formatPrice(price: string | number | null | undefined): string {
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
