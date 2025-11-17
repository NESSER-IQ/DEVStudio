/**
 * HoverService - Manages hover providers
 */

import { IHoverProvider, Hover, Position } from './types';

/**
 * HoverService manages hover providers for different languages
 */
export class HoverService {
  private providers: Map<string, IHoverProvider[]> = new Map();

  /**
   * Registers a hover provider for a language
   */
  registerHoverProvider(
    languageId: string,
    provider: IHoverProvider
  ): void {
    if (!this.providers.has(languageId)) {
      this.providers.set(languageId, []);
    }

    this.providers.get(languageId)!.push(provider);
  }

  /**
   * Unregisters a hover provider
   */
  unregisterHoverProvider(
    languageId: string,
    provider: IHoverProvider
  ): void {
    const providers = this.providers.get(languageId);
    if (!providers) {
      return;
    }

    const index = providers.indexOf(provider);
    if (index >= 0) {
      providers.splice(index, 1);
    }
  }

  /**
   * Gets hover information for a document position
   */
  async getHover(
    languageId: string,
    document: string,
    position: Position
  ): Promise<Hover | null> {
    const providers = this.providers.get(languageId);
    if (!providers || providers.length === 0) {
      return null;
    }

    // Get hover from the first provider that returns a result
    for (const provider of providers) {
      try {
        const hover = await provider.provideHover(document, position);
        if (hover) {
          return hover;
        }
      } catch (error) {
        console.error('Error getting hover:', error);
      }
    }

    return null;
  }
}

/**
 * Global hover service instance
 */
export const hoverService = new HoverService();
