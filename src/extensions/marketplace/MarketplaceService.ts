/**
 * MarketplaceService - Extension marketplace
 */

import { ExtensionManifest } from '../api/types';

/**
 * Marketplace extension
 */
export interface MarketplaceExtension {
  id: string;
  manifest: ExtensionManifest;
  publisher: {
    name: string;
    displayName: string;
  };
  statistics: {
    installs: number;
    downloads: number;
    rating: number;
    ratingCount: number;
  };
  versions: {
    version: string;
    downloadUrl: string;
    releaseDate: Date;
    changelog?: string;
  }[];
  readme?: string;
  changelog?: string;
  icon?: string;
  screenshots?: string[];
  tags: string[];
  featured: boolean;
}

/**
 * Search options
 */
export interface SearchOptions {
  query?: string;
  category?: string;
  sortBy?: 'relevance' | 'installs' | 'rating' | 'date';
  page?: number;
  pageSize?: number;
}

/**
 * Search result
 */
export interface SearchResult {
  extensions: MarketplaceExtension[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * MarketplaceService provides access to extension marketplace
 */
export class MarketplaceService {
  private marketplaceUrl: string = 'https://marketplace.example.com';
  private cache: Map<string, MarketplaceExtension> = new Map();

  /**
   * Searches for extensions
   */
  async search(options: SearchOptions = {}): Promise<SearchResult> {
    try {
      // TODO: Implement actual marketplace API call
      // For now, return mock data
      const mockExtensions = this.getMockExtensions();

      let filtered = mockExtensions;

      // Filter by query
      if (options.query) {
        const query = options.query.toLowerCase();
        filtered = filtered.filter(ext =>
          ext.manifest.displayName.toLowerCase().includes(query) ||
          ext.manifest.description.toLowerCase().includes(query) ||
          ext.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Filter by category
      if (options.category) {
        filtered = filtered.filter(ext =>
          ext.manifest.categories?.includes(options.category!)
        );
      }

      // Sort
      const sortBy = options.sortBy || 'relevance';
      filtered = this.sortExtensions(filtered, sortBy);

      // Paginate
      const page = options.page || 1;
      const pageSize = options.pageSize || 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedExtensions = filtered.slice(startIndex, endIndex);

      return {
        extensions: paginatedExtensions,
        total: filtered.length,
        page,
        pageSize
      };
    } catch (error) {
      throw new Error(`Failed to search extensions: ${error}`);
    }
  }

  /**
   * Gets extension details
   */
  async getExtension(extensionId: string): Promise<MarketplaceExtension | null> {
    try {
      // Check cache
      if (this.cache.has(extensionId)) {
        return this.cache.get(extensionId)!;
      }

      // TODO: Fetch from marketplace API
      const mockExtensions = this.getMockExtensions();
      const extension = mockExtensions.find(ext => ext.id === extensionId);

      if (extension) {
        this.cache.set(extensionId, extension);
      }

      return extension || null;
    } catch (error) {
      throw new Error(`Failed to get extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Downloads an extension
   */
  async download(extensionId: string, version?: string): Promise<string> {
    try {
      const extension = await this.getExtension(extensionId);
      if (!extension) {
        throw new Error(`Extension ${extensionId} not found`);
      }

      // Get version to download
      const versionToDownload = version || extension.versions[0].version;
      const versionInfo = extension.versions.find(v => v.version === versionToDownload);

      if (!versionInfo) {
        throw new Error(`Version ${versionToDownload} not found`);
      }

      // TODO: Download extension package
      const downloadUrl = versionInfo.downloadUrl;
      const localPath = `/extensions/downloads/${extensionId}-${versionToDownload}.vsix`;

      console.log(`Downloading extension from: ${downloadUrl} to ${localPath}`);

      // Mock: Return local path
      return localPath;
    } catch (error) {
      throw new Error(`Failed to download extension ${extensionId}: ${error}`);
    }
  }

  /**
   * Gets featured extensions
   */
  async getFeatured(limit: number = 10): Promise<MarketplaceExtension[]> {
    try {
      const mockExtensions = this.getMockExtensions();
      return mockExtensions.filter(ext => ext.featured).slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to get featured extensions: ${error}`);
    }
  }

  /**
   * Gets popular extensions
   */
  async getPopular(limit: number = 10): Promise<MarketplaceExtension[]> {
    try {
      const mockExtensions = this.getMockExtensions();
      const sorted = this.sortExtensions(mockExtensions, 'installs');
      return sorted.slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to get popular extensions: ${error}`);
    }
  }

  /**
   * Sorts extensions
   */
  private sortExtensions(
    extensions: MarketplaceExtension[],
    sortBy: 'relevance' | 'installs' | 'rating' | 'date'
  ): MarketplaceExtension[] {
    const sorted = [...extensions];

    switch (sortBy) {
      case 'installs':
        sorted.sort((a, b) => b.statistics.installs - a.statistics.installs);
        break;

      case 'rating':
        sorted.sort((a, b) => b.statistics.rating - a.statistics.rating);
        break;

      case 'date':
        sorted.sort((a, b) =>
          new Date(b.versions[0].releaseDate).getTime() -
          new Date(a.versions[0].releaseDate).getTime()
        );
        break;

      case 'relevance':
      default:
        // Keep current order for relevance
        break;
    }

    return sorted;
  }

  /**
   * Gets mock extensions for demonstration
   */
  private getMockExtensions(): MarketplaceExtension[] {
    return [
      {
        id: 'publisher.prettier',
        manifest: {
          name: 'prettier',
          displayName: 'Prettier - Code Formatter',
          version: '1.0.0',
          publisher: 'publisher',
          description: 'Code formatter using prettier',
          categories: ['Formatters']
        },
        publisher: {
          name: 'publisher',
          displayName: 'Publisher'
        },
        statistics: {
          installs: 10000000,
          downloads: 15000000,
          rating: 4.5,
          ratingCount: 5000
        },
        versions: [
          {
            version: '1.0.0',
            downloadUrl: 'https://marketplace.example.com/downloads/prettier-1.0.0.vsix',
            releaseDate: new Date()
          }
        ],
        tags: ['formatter', 'prettier', 'code-style'],
        featured: true
      },
      {
        id: 'publisher.eslint',
        manifest: {
          name: 'eslint',
          displayName: 'ESLint',
          version: '2.0.0',
          publisher: 'publisher',
          description: 'Integrates ESLint into the editor',
          categories: ['Linters']
        },
        publisher: {
          name: 'publisher',
          displayName: 'Publisher'
        },
        statistics: {
          installs: 8000000,
          downloads: 12000000,
          rating: 4.3,
          ratingCount: 4000
        },
        versions: [
          {
            version: '2.0.0',
            downloadUrl: 'https://marketplace.example.com/downloads/eslint-2.0.0.vsix',
            releaseDate: new Date()
          }
        ],
        tags: ['linter', 'eslint', 'javascript'],
        featured: true
      },
      {
        id: 'publisher.gitlens',
        manifest: {
          name: 'gitlens',
          displayName: 'GitLens',
          version: '1.5.0',
          publisher: 'publisher',
          description: 'Supercharge Git within the editor',
          categories: ['SCM Providers']
        },
        publisher: {
          name: 'publisher',
          displayName: 'Publisher'
        },
        statistics: {
          installs: 5000000,
          downloads: 7000000,
          rating: 4.8,
          ratingCount: 3000
        },
        versions: [
          {
            version: '1.5.0',
            downloadUrl: 'https://marketplace.example.com/downloads/gitlens-1.5.0.vsix',
            releaseDate: new Date()
          }
        ],
        tags: ['git', 'scm', 'version-control'],
        featured: true
      }
    ];
  }
}

/**
 * Global marketplace service instance
 */
export const marketplaceService = new MarketplaceService();
