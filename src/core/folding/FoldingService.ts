/**
 * FoldingService - Code folding functionality
 */

import { Position } from '../editor/types';

/**
 * Folding range
 */
export interface FoldingRange {
  start: number;      // Start line
  end: number;        // End line
  kind?: FoldingKind;
}

/**
 * Folding kind
 */
export enum FoldingKind {
  Comment = 'comment',
  Imports = 'imports',
  Region = 'region'
}

/**
 * Folding provider interface
 */
export interface IFoldingProvider {
  provideFoldingRanges(document: string): FoldingRange[] | Promise<FoldingRange[]>;
}

/**
 * FoldingService manages code folding
 */
export class FoldingService {
  private providers: Map<string, IFoldingProvider[]> = new Map();
  private foldedRanges: Set<string> = new Set();

  /**
   * Registers a folding provider
   */
  registerFoldingProvider(
    languageId: string,
    provider: IFoldingProvider
  ): void {
    if (!this.providers.has(languageId)) {
      this.providers.set(languageId, []);
    }
    this.providers.get(languageId)!.push(provider);
  }

  /**
   * Gets folding ranges for a document
   */
  async getFoldingRanges(
    languageId: string,
    document: string
  ): Promise<FoldingRange[]> {
    const providers = this.providers.get(languageId);
    if (!providers || providers.length === 0) {
      // Default folding based on brackets
      return this.getDefaultFoldingRanges(document);
    }

    const allRanges: FoldingRange[] = [];

    for (const provider of providers) {
      try {
        const ranges = await provider.provideFoldingRanges(document);
        if (ranges) {
          allRanges.push(...ranges);
        }
      } catch (error) {
        console.error('Error getting folding ranges:', error);
      }
    }

    return allRanges;
  }

  /**
   * Folds a range
   */
  fold(start: number, end: number): void {
    const key = `${start}:${end}`;
    this.foldedRanges.add(key);
  }

  /**
   * Unfolds a range
   */
  unfold(start: number, end: number): void {
    const key = `${start}:${end}`;
    this.foldedRanges.delete(key);
  }

  /**
   * Checks if a range is folded
   */
  isFolded(start: number, end: number): boolean {
    const key = `${start}:${end}`;
    return this.foldedRanges.has(key);
  }

  /**
   * Unfolds all ranges
   */
  unfoldAll(): void {
    this.foldedRanges.clear();
  }

  /**
   * Gets default folding ranges based on brackets
   */
  private getDefaultFoldingRanges(document: string): FoldingRange[] {
    const ranges: FoldingRange[] = [];
    const lines = document.split('\n');
    const stack: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Count opening and closing brackets
      for (let j = 0; j < line.length; j++) {
        const char = line[j];

        if (char === '{' || char === '[' || char === '(') {
          stack.push(i);
        } else if (char === '}' || char === ']' || char === ')') {
          if (stack.length > 0) {
            const start = stack.pop()!;
            if (i - start > 1) {  // Only fold multi-line blocks
              ranges.push({
                start,
                end: i
              });
            }
          }
        }
      }
    }

    return ranges;
  }
}

/**
 * Global folding service instance
 */
export const foldingService = new FoldingService();
