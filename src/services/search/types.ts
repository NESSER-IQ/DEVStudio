/**
 * Search service types and interfaces
 */

import { Position } from '../../core/editor/types';

/**
 * Search options
 */
export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
  includeFiles?: string;
  excludeFiles?: string;
  maxResults?: number;
}

/**
 * Search match
 */
export interface SearchMatch {
  file: string;
  line: number;
  column: number;
  matchText: string;
  lineText: string;
  range: {
    start: Position;
    end: Position;
  };
}

/**
 * Search result
 */
export interface SearchResult {
  query: string;
  matches: SearchMatch[];
  totalMatches: number;
  filesSearched: number;
  duration: number;
}

/**
 * Replace options
 */
export interface ReplaceOptions extends SearchOptions {
  preserveCase?: boolean;
}

/**
 * Replace result
 */
export interface ReplaceResult {
  filesModified: number;
  replacements: number;
  matches: SearchMatch[];
}

/**
 * Search provider interface
 */
export interface ISearchProvider {
  /**
   * Searches for text
   */
  search(
    query: string,
    searchPath: string,
    options?: SearchOptions
  ): Promise<SearchResult>;

  /**
   * Replaces text
   */
  replace(
    query: string,
    replacement: string,
    searchPath: string,
    options?: ReplaceOptions
  ): Promise<ReplaceResult>;

  /**
   * Cancels current search
   */
  cancel(): void;
}
