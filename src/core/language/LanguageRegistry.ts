/**
 * LanguageRegistry - Manages language providers
 */

import { ILanguageProvider } from './types';

/**
 * Registry for language providers
 */
export class LanguageRegistry {
  private providers: Map<string, ILanguageProvider> = new Map();
  private extensionMap: Map<string, string> = new Map();

  /**
   * Registers a language provider
   */
  registerLanguage(provider: ILanguageProvider): void {
    const languageId = provider.getLanguageId();

    if (this.providers.has(languageId)) {
      console.warn(`Language already registered: ${languageId}`);
      return;
    }

    this.providers.set(languageId, provider);

    // Map file extensions to language ID
    const config = provider.getConfiguration();
    for (const ext of config.extensions) {
      this.extensionMap.set(ext, languageId);
    }
  }

  /**
   * Unregisters a language provider
   */
  unregisterLanguage(languageId: string): void {
    const provider = this.providers.get(languageId);
    if (!provider) {
      return;
    }

    // Remove extension mappings
    const config = provider.getConfiguration();
    for (const ext of config.extensions) {
      if (this.extensionMap.get(ext) === languageId) {
        this.extensionMap.delete(ext);
      }
    }

    this.providers.delete(languageId);
  }

  /**
   * Gets a language provider by ID
   */
  getLanguage(languageId: string): ILanguageProvider | undefined {
    return this.providers.get(languageId);
  }

  /**
   * Gets a language provider for a file
   */
  getLanguageForFile(fileName: string): ILanguageProvider | undefined {
    const ext = this.getFileExtension(fileName);
    const languageId = this.extensionMap.get(ext);

    if (languageId) {
      return this.providers.get(languageId);
    }

    // Fallback: search for a provider that supports this file
    for (const provider of this.providers.values()) {
      if (provider.supportsFile(fileName)) {
        return provider;
      }
    }

    return undefined;
  }

  /**
   * Gets all registered language IDs
   */
  getLanguageIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Gets all language providers
   */
  getAllLanguages(): ILanguageProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Checks if a language is registered
   */
  hasLanguage(languageId: string): boolean {
    return this.providers.has(languageId);
  }

  /**
   * Gets file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot >= 0 ? fileName.substring(lastDot) : '';
  }
}

/**
 * Global language registry instance
 */
export const languageRegistry = new LanguageRegistry();
