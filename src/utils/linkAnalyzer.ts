// Internal Link Analysis & Optimization Utility
export interface LinkData {
  fromPage: string;
  toPage: string;
  anchorText: string;
  position: number;
  context: string;
  type: 'pillar' | 'cluster' | 'service' | 'cross-pillar';
  priority: 'high' | 'medium' | 'low';
}

export interface LinkReport {
  totalLinks: number;
  pillarDistribution: Record<string, number>;
  anchorTextDiversity: number;
  topLinkedPages: Array<{ page: string; count: number }>;
  recommendations: string[];
}

export class LinkAnalyzer {
  private links: LinkData[] = [];
  
  // Pillar page definitions
  private pillars = {
    'website-development': [
      '/layanan/pembuatan-website',
      '/layanan/template-website'
    ],
    'it-support': [
      '/services/it-support'
    ],
    'umkm-digital': [
      '/layanan/sistem-pos'
    ],
    'tech-ecosystem': []
  };

  // Content clusters
  private clusters = {
    'website-development': [
      '/blog/web-design-responsive-surabaya',
      '/blog/jasa-pembuatan-website-surabaya-terbaik',
      '/blog/jasa-pembuatan-website-surabaya',
      '/blog/toko-online-surabaya',
      '/blog/software-development-surabaya',
      '/blog/software-development-surabaya-terbaik'
    ],
    'it-support': [
      '/blog/it-infrastructure-planning-surabaya',
      '/blog/server-maintenance-surabaya',
      '/blog/backup-recovery-sistem-surabaya',
      '/blog/sistem-keamanan-jaringan-surabaya',
      '/blog/troubleshooting-komputer-surabaya',
      '/blog/konsultan-it-sidoarjo-terpercaya',
      '/blog/jasa-it-support-surabaya-terpercaya'
    ],
    'umkm-digital': [
      '/blog/digital-transformation-umkm-surabaya',
      '/blog/digitalisasi-umkm-surabaya-terbaik',
      '/blog/sistem-pos-surabaya-terbaik-untuk-umkm',
      '/blog/panduan-memilih-sistem-pos-untuk-umkm',
      '/blog/smart-city-surabaya-teknologi'
    ],
    'tech-ecosystem': [
      '/blog/startup-tech-surabaya-sidoarjo',
      '/blog/coworking-space-tech-surabaya'
    ]
  };

  addLink(linkData: LinkData): void {
    this.links.push(linkData);
  }

  // Analyze link from content
  analyzeLink(fromPage: string, toPage: string, anchorText: string, position: number, context: string): LinkData {
    const type = this.determineLinkType(fromPage, toPage);
    const priority = this.calculatePriority(type, position);
    
    return {
      fromPage,
      toPage,
      anchorText,
      position,
      context,
      type,
      priority
    };
  }

  private determineLinkType(fromPage: string, toPage: string): LinkData['type'] {
    // Check if linking to pillar page
    const toPillar = Object.values(this.pillars).flat().includes(toPage);
    if (toPillar) return 'pillar';

    // Check if linking to service page
    if (toPage.includes('/services/') || toPage.includes('/layanan/')) {
      return 'service';
    }

    // Check if same cluster
    const fromCluster = this.getPageCluster(fromPage);
    const toCluster = this.getPageCluster(toPage);
    
    if (fromCluster && toCluster) {
      if (fromCluster === toCluster) return 'cluster';
      return 'cross-pillar';
    }

    return 'cluster';
  }

  private getPageCluster(page: string): string | null {
    for (const [cluster, pages] of Object.entries(this.clusters)) {
      if (pages.includes(page)) return cluster;
    }
    return null;
  }

  private calculatePriority(type: LinkData['type'], position: number): LinkData['priority'] {
    // Pillar links are always high priority
    if (type === 'pillar') return 'high';
    
    // Service links in early content are high priority
    if (type === 'service' && position <= 200) return 'high';
    
    // Early position cluster links are medium priority
    if (position <= 200) return 'medium';
    
    // Everything else is low priority
    return 'low';
  }

  generateReport(): LinkReport {
    const totalLinks = this.links.length;
    
    // Calculate pillar distribution
    const pillarDistribution: Record<string, number> = {};
    this.links.forEach(link => {
      const cluster = this.getPageCluster(link.toPage);
      if (cluster) {
        pillarDistribution[cluster] = (pillarDistribution[cluster] || 0) + 1;
      }
    });

    // Calculate anchor text diversity
    const anchorTexts = new Set(this.links.map(link => link.anchorText.toLowerCase()));
    const anchorTextDiversity = anchorTexts.size / totalLinks;

    // Find top linked pages
    const pageCount: Record<string, number> = {};
    this.links.forEach(link => {
      pageCount[link.toPage] = (pageCount[link.toPage] || 0) + 1;
    });
    
    const topLinkedPages = Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Generate recommendations
    const recommendations = this.generateRecommendations(pillarDistribution, anchorTextDiversity, topLinkedPages);

    return {
      totalLinks,
      pillarDistribution,
      anchorTextDiversity,
      topLinkedPages,
      recommendations
    };
  }

  private generateRecommendations(
    pillarDistribution: Record<string, number>,
    anchorTextDiversity: number,
    topLinkedPages: Array<{ page: string; count: number }>
  ): string[] {
    const recommendations: string[] = [];

    // Check pillar distribution balance
    const totalPillarLinks = Object.values(pillarDistribution).reduce((a, b) => a + b, 0);
    const averagePerPillar = totalPillarLinks / Object.keys(this.pillars).length;
    
    Object.entries(pillarDistribution).forEach(([pillar, count]) => {
      if (count < averagePerPillar * 0.7) {
        recommendations.push(`Increase internal links to ${pillar} pillar (currently ${count}, should be ~${Math.round(averagePerPillar)})`);
      }
    });

    // Check anchor text diversity
    if (anchorTextDiversity < 0.7) {
      recommendations.push(`Improve anchor text diversity (currently ${(anchorTextDiversity * 100).toFixed(1)}%, should be >70%)`);
    }

    // Check for over-optimization
    const topPage = topLinkedPages[0];
    if (topPage && topPage.count > totalPillarLinks * 0.3) {
      recommendations.push(`Reduce over-optimization of ${topPage.page} (${topPage.count} links, ${((topPage.count / this.links.length) * 100).toFixed(1)}% of total)`);
    }

    // Check for missing pillar links
    const pillarPages = Object.values(this.pillars).flat();
    pillarPages.forEach(pillarPage => {
      const linkCount = topLinkedPages.find(p => p.page === pillarPage)?.count || 0;
      if (linkCount < 3) {
        recommendations.push(`Add more internal links to pillar page ${pillarPage} (currently ${linkCount} links)`);
      }
    });

    return recommendations;
  }

  // Suggest optimal anchor text for a link
  suggestAnchorText(fromPage: string, toPage: string, context: string): string[] {
    const toCluster = this.getPageCluster(toPage);
    const isPillar = Object.values(this.pillars).flat().includes(toPage);
    
    const suggestions: string[] = [];
    
    if (isPillar) {
      if (toPage.includes('pembuatan-website')) {
        suggestions.push(
          'jasa pembuatan website profesional di Surabaya',
          'layanan pengembangan website terpercaya',
          'web development Surabaya',
          'pembuatan website berkualitas'
        );
      } else if (toPage.includes('it-support')) {
        suggestions.push(
          'layanan IT support 24/7',
          'jasa maintenance IT profesional',
          'dukungan teknis terpercaya',
          'konsultan IT Surabaya'
        );
      } else if (toPage.includes('sistem-pos')) {
        suggestions.push(
          'sistem POS untuk UMKM',
          'solusi kasir digital',
          'point of sale modern',
          'sistem kasir terpercaya'
        );
      }
    } else if (toCluster) {
      switch (toCluster) {
        case 'website-development':
          suggestions.push(
            'panduan web development',
            'tips pembuatan website',
            'strategi digital marketing',
            'solusi website profesional'
          );
          break;
        case 'it-support':
          suggestions.push(
            'panduan IT infrastructure',
            'tips maintenance server',
            'solusi backup data',
            'keamanan jaringan'
          );
          break;
        case 'umkm-digital':
          suggestions.push(
            'transformasi digital UMKM',
            'digitalisasi bisnis kecil',
            'modernisasi usaha',
            'strategi digital marketing'
          );
          break;
      }
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  // Export data for analysis
  exportData(): {
    links: LinkData[];
    report: LinkReport;
    pillars: typeof this.pillars;
    clusters: typeof this.clusters;
  } {
    return {
      links: this.links,
      report: this.generateReport(),
      pillars: this.pillars,
      clusters: this.clusters
    };
  }
}

// Utility functions for common use cases
export function createLinkAnalyzer(): LinkAnalyzer {
  return new LinkAnalyzer();
}

export function analyzePage(content: string, pageUrl: string): LinkData[] {
  const analyzer = createLinkAnalyzer();
  const links: LinkData[] = [];
  
  // Simple regex to find markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const anchorText = match[1];
    const url = match[2];
    const position = match.index;
    const context = content.substring(Math.max(0, position - 100), position + 100);
    
    // Only analyze internal links
    if (url.startsWith('/')) {
      const linkData = analyzer.analyzeLink(pageUrl, url, anchorText, position, context);
      links.push(linkData);
    }
  }
  
  return links;
}

export default LinkAnalyzer;