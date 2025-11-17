/**
 * NavigationService - Code navigation features
 * Go to Definition, Find References, etc.
 */

import { Position } from '../editor/types';
import {
  IDefinitionProvider,
  IReferenceProvider,
  Location
} from '../intellisense/types';

/**
 * NavigationService provides code navigation features
 */
export class NavigationService {
  private definitionProviders: Map<string, IDefinitionProvider[]> = new Map();
  private referenceProviders: Map<string, IReferenceProvider[]> = new Map();

  /**
   * Registers a definition provider
   */
  registerDefinitionProvider(
    languageId: string,
    provider: IDefinitionProvider
  ): void {
    if (!this.definitionProviders.has(languageId)) {
      this.definitionProviders.set(languageId, []);
    }
    this.definitionProviders.get(languageId)!.push(provider);
  }

  /**
   * Registers a reference provider
   */
  registerReferenceProvider(
    languageId: string,
    provider: IReferenceProvider
  ): void {
    if (!this.referenceProviders.has(languageId)) {
      this.referenceProviders.set(languageId, []);
    }
    this.referenceProviders.get(languageId)!.push(provider);
  }

  /**
   * Goes to definition
   */
  async goToDefinition(
    languageId: string,
    document: string,
    position: Position
  ): Promise<Location | Location[] | null> {
    const providers = this.definitionProviders.get(languageId);
    if (!providers || providers.length === 0) {
      return null;
    }

    for (const provider of providers) {
      try {
        const result = await provider.provideDefinition(document, position);
        if (result) {
          return result;
        }
      } catch (error) {
        console.error('Error getting definition:', error);
      }
    }

    return null;
  }

  /**
   * Finds references
   */
  async findReferences(
    languageId: string,
    document: string,
    position: Position,
    includeDeclaration: boolean = true
  ): Promise<Location[] | null> {
    const providers = this.referenceProviders.get(languageId);
    if (!providers || providers.length === 0) {
      return null;
    }

    const allLocations: Location[] = [];

    for (const provider of providers) {
      try {
        const locations = await provider.provideReferences(
          document,
          position,
          { includeDeclaration }
        );

        if (locations) {
          allLocations.push(...locations);
        }
      } catch (error) {
        console.error('Error finding references:', error);
      }
    }

    return allLocations.length > 0 ? allLocations : null;
  }
}

/**
 * Global navigation service instance
 */
export const navigationService = new NavigationService();
