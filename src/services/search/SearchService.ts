/**
 * SearchService - Advanced search and replace
 */

import {
  ISearchProvider,
  SearchOptions,
  SearchResult,
  SearchMatch,
  ReplaceOptions,
  ReplaceResult
} from './types';

/**
 * SearchService implementation
 */
export class SearchService implements ISearchProvider {
  private cancelled: boolean = false;

  /**
   * Searches for text
   */
  async search(
    query: string,
    searchPath: string,
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const startTime = Date.now();
    this.cancelled = false;

    const matches: SearchMatch[] = [];
    let filesSearched = 0;

    try {
      // TODO: Use file system API to search files
      // For now, return mock results
      const mockMatches = this.getMockMatches(query, options);
      matches.push(...mockMatches);
      filesSearched = 10;

      const duration = Date.now() - startTime;

      return {
        query,
        matches,
        totalMatches: matches.length,
        filesSearched,
        duration
      };
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }

  /**
   * Replaces text
   */
  async replace(
    query: string,
    replacement: string,
    searchPath: string,
    options: ReplaceOptions = {}
  ): Promise<ReplaceResult> {
    this.cancelled = false;

    try {
      // First, find all matches
      const searchResult = await this.search(query, searchPath, options);

      if (this.cancelled) {
        return {
          filesModified: 0,
          replacements: 0,
          matches: []
        };
      }

      // Group matches by file
      const fileMatches = new Map<string, SearchMatch[]>();
      for (const match of searchResult.matches) {
        if (!fileMatches.has(match.file)) {
          fileMatches.set(match.file, []);
        }
        fileMatches.get(match.file)!.push(match);
      }

      // Replace in each file
      let totalReplacements = 0;
      for (const [file, matches] of fileMatches.entries()) {
        if (this.cancelled) {
          break;
        }

        // TODO: Read file, replace matches, write file
        totalReplacements += matches.length;
      }

      return {
        filesModified: fileMatches.size,
        replacements: totalReplacements,
        matches: searchResult.matches
      };
    } catch (error) {
      throw new Error(`Replace failed: ${error}`);
    }
  }

  /**
   * Cancels current search
   */
  cancel(): void {
    this.cancelled = true;
  }

  /**
   * Gets mock matches for demonstration
   */
  private getMockMatches(query: string, options: SearchOptions): SearchMatch[] {
    // Mock implementation
    return [
      {
        file: '/workspace/src/main.ts',
        line: 10,
        column: 5,
        matchText: query,
        lineText: `const result = ${query}();`,
        range: {
          start: { line: 10, column: 5 },
          end: { line: 10, column: 5 + query.length }
        }
      },
      {
        file: '/workspace/src/utils.ts',
        line: 25,
        column: 12,
        matchText: query,
        lineText: `function ${query}Handler() {`,
        range: {
          start: { line: 25, column: 12 },
          end: { line: 25, column: 12 + query.length }
        }
      }
    ];
  }

  /**
   * Checks if text matches query
   */
  private matches(text: string, query: string, options: SearchOptions): boolean {
    if (options.regex) {
      try {
        const flags = options.caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(query, flags);
        return regex.test(text);
      } catch {
        return false;
      }
    }

    const searchText = options.caseSensitive ? text : text.toLowerCase();
    const searchQuery = options.caseSensitive ? query : query.toLowerCase();

    if (options.wholeWord) {
      const regex = new RegExp(`\\b${this.escapeRegex(searchQuery)}\\b`, 'g');
      return regex.test(searchText);
    }

    return searchText.includes(searchQuery);
  }

  /**
   * Escapes regex special characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Performs replacement
   */
  private performReplacement(
    text: string,
    query: string,
    replacement: string,
    options: ReplaceOptions
  ): string {
    if (options.regex) {
      const flags = options.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(query, flags);
      return text.replace(regex, replacement);
    }

    const searchText = options.caseSensitive ? text : text.toLowerCase();
    const searchQuery = options.caseSensitive ? query : query.toLowerCase();

    let result = text;
    let index = searchText.indexOf(searchQuery);

    while (index >= 0) {
      const before = result.substring(0, index);
      const after = result.substring(index + query.length);

      let actualReplacement = replacement;
      if (options.preserveCase) {
        actualReplacement = this.preserveCase(
          result.substring(index, index + query.length),
          replacement
        );
      }

      result = before + actualReplacement + after;
      searchText = options.caseSensitive ? result : result.toLowerCase();
      index = searchText.indexOf(searchQuery, index + actualReplacement.length);
    }

    return result;
  }

  /**
   * Preserves case of original text
   */
  private preserveCase(original: string, replacement: string): string {
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    } else if (original === original.toLowerCase()) {
      return replacement.toLowerCase();
    } else if (original[0] === original[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.substring(1).toLowerCase();
    }
    return replacement;
  }
}

/**
 * Global search service instance
 */
export const searchService = new SearchService();
