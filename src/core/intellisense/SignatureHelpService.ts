/**
 * SignatureHelpService - Manages signature help providers
 */

import { ISignatureHelpProvider, SignatureHelp, Position } from './types';

/**
 * SignatureHelpService manages signature help providers
 */
export class SignatureHelpService {
  private providers: Map<string, ISignatureHelpProvider[]> = new Map();

  /**
   * Registers a signature help provider for a language
   */
  registerSignatureHelpProvider(
    languageId: string,
    provider: ISignatureHelpProvider
  ): void {
    if (!this.providers.has(languageId)) {
      this.providers.set(languageId, []);
    }

    this.providers.get(languageId)!.push(provider);
  }

  /**
   * Unregisters a signature help provider
   */
  unregisterSignatureHelpProvider(
    languageId: string,
    provider: ISignatureHelpProvider
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
   * Gets signature help for a document position
   */
  async getSignatureHelp(
    languageId: string,
    document: string,
    position: Position
  ): Promise<SignatureHelp | null> {
    const providers = this.providers.get(languageId);
    if (!providers || providers.length === 0) {
      return null;
    }

    // Get signature help from the first provider that returns a result
    for (const provider of providers) {
      try {
        const help = await provider.provideSignatureHelp(document, position);
        if (help) {
          return help;
        }
      } catch (error) {
        console.error('Error getting signature help:', error);
      }
    }

    return null;
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
   * Gets retrigger characters for a language
   */
  getRetriggerCharacters(languageId: string): string[] {
    const providers = this.providers.get(languageId);
    if (!providers) {
      return [];
    }

    const characters = new Set<string>();

    for (const provider of providers) {
      if (provider.retriggerCharacters) {
        provider.retriggerCharacters.forEach(char => characters.add(char));
      }
    }

    return Array.from(characters);
  }
}

/**
 * Global signature help service instance
 */
export const signatureHelpService = new SignatureHelpService();
