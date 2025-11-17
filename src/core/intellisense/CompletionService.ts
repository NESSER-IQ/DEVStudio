/**
 * CompletionService - Manages completion providers
 */

import {
  ICompletionProvider,
  CompletionItem,
  CompletionContext,
  Position
} from './types';

/**
 * CompletionService manages completion providers for different languages
 */
export class CompletionService {
  private providers: Map<string, ICompletionProvider[]> = new Map();

  /**
   * Registers a completion provider for a language
   */
  registerCompletionProvider(
    languageId: string,
    provider: ICompletionProvider
  ): void {
    if (!this.providers.has(languageId)) {
      this.providers.set(languageId, []);
    }

    this.providers.get(languageId)!.push(provider);
  }

  /**
   * Unregisters a completion provider
   */
  unregisterCompletionProvider(
    languageId: string,
    provider: ICompletionProvider
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
   * Gets completion items for a document
   */
  async getCompletionItems(
    languageId: string,
    document: string,
    position: Position,
    context: CompletionContext
  ): Promise<CompletionItem[]> {
    const providers = this.providers.get(languageId);
    if (!providers || providers.length === 0) {
      return [];
    }

    const allItems: CompletionItem[] = [];

    // Get items from all providers
    for (const provider of providers) {
      try {
        const items = await provider.provideCompletionItems(
          document,
          position,
          context
        );

        if (items && items.length > 0) {
          allItems.push(...items);
        }
      } catch (error) {
        console.error('Error getting completion items:', error);
      }
    }

    // Sort and deduplicate items
    return this.sortAndDeduplicateItems(allItems);
  }

  /**
   * Resolves a completion item
   */
  async resolveCompletionItem(
    languageId: string,
    item: CompletionItem
  ): Promise<CompletionItem> {
    const providers = this.providers.get(languageId);
    if (!providers) {
      return item;
    }

    // Try to resolve with the first provider that has a resolve method
    for (const provider of providers) {
      if (provider.resolveCompletionItem) {
        try {
          const resolved = await provider.resolveCompletionItem(item);
          if (resolved) {
            return resolved;
          }
        } catch (error) {
          console.error('Error resolving completion item:', error);
        }
      }
    }

    return item;
  }

  /**
   * Gets trigger characters for a language
   */
  getTriggerCharacters(languageId: string): string[] {
    const providers = this.providers.get(languageId);
    if (!providers) {
      return [];
    }

    const characters = new Set<string>();

    for (const provider of providers) {
      if (provider.triggerCharacters) {
        provider.triggerCharacters.forEach(char => characters.add(char));
      }
    }

    return Array.from(characters);
  }

  /**
   * Sorts and deduplicates completion items
   */
  private sortAndDeduplicateItems(items: CompletionItem[]): CompletionItem[] {
    // Deduplicate by label
    const seen = new Set<string>();
    const unique: CompletionItem[] = [];

    for (const item of items) {
      if (!seen.has(item.label)) {
        seen.add(item.label);
        unique.push(item);
      }
    }

    // Sort by sortText or label
    unique.sort((a, b) => {
      const sortA = a.sortText || a.label;
      const sortB = b.sortText || b.label;
      return sortA.localeCompare(sortB);
    });

    return unique;
  }

  /**
   * Filters completion items based on typed text
   */
  filterCompletionItems(
    items: CompletionItem[],
    typedText: string
  ): CompletionItem[] {
    if (!typedText) {
      return items;
    }

    const lowerTyped = typedText.toLowerCase();

    return items.filter(item => {
      const filterText = (item.filterText || item.label).toLowerCase();
      return filterText.includes(lowerTyped) ||
             this.fuzzyMatch(filterText, lowerTyped);
    });
  }

  /**
   * Performs fuzzy matching
   */
  private fuzzyMatch(text: string, pattern: string): boolean {
    let patternIdx = 0;
    let textIdx = 0;

    while (patternIdx < pattern.length && textIdx < text.length) {
      if (pattern[patternIdx] === text[textIdx]) {
        patternIdx++;
      }
      textIdx++;
    }

    return patternIdx === pattern.length;
  }
}

/**
 * Global completion service instance
 */
export const completionService = new CompletionService();
