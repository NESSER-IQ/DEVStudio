/**
 * LanguageProvider - Base class for language support
 */

import {
  ILanguageProvider,
  LanguageConfiguration,
  Token,
  TokenType,
  SyntaxRule
} from './types';

/**
 * Base language provider implementation
 */
export class LanguageProvider implements ILanguageProvider {
  protected config: LanguageConfiguration;

  constructor(config: LanguageConfiguration) {
    this.config = config;
  }

  /**
   * Gets the language ID
   */
  getLanguageId(): string {
    return this.config.id;
  }

  /**
   * Gets the language name
   */
  getLanguageName(): string {
    return this.config.name;
  }

  /**
   * Checks if this provider supports a file
   */
  supportsFile(fileName: string): boolean {
    const ext = this.getFileExtension(fileName);
    return this.config.extensions.includes(ext);
  }

  /**
   * Tokenizes entire text
   */
  tokenize(text: string): Token[] {
    const lines = text.split('\n');
    const tokens: Token[] = [];

    for (let i = 0; i < lines.length; i++) {
      const lineTokens = this.tokenizeLine(lines[i], i);
      tokens.push(...lineTokens);
    }

    return tokens;
  }

  /**
   * Tokenizes a single line
   */
  tokenizeLine(line: string, lineNumber: number): Token[] {
    const tokens: Token[] = [];
    let currentIndex = 0;

    while (currentIndex < line.length) {
      const remainingText = line.substring(currentIndex);
      let matched = false;

      // Try to match syntax rules
      for (const rule of this.getSortedRules()) {
        rule.pattern.lastIndex = 0; // Reset regex
        const match = rule.pattern.exec(remainingText);

        if (match && match.index === 0) {
          tokens.push({
            type: rule.tokenType,
            value: match[0],
            startIndex: currentIndex,
            endIndex: currentIndex + match[0].length,
            line: lineNumber
          });

          currentIndex += match[0].length;
          matched = true;
          break;
        }
      }

      // If no match, treat as text
      if (!matched) {
        const char = line[currentIndex];
        tokens.push({
          type: TokenType.Text,
          value: char,
          startIndex: currentIndex,
          endIndex: currentIndex + 1,
          line: lineNumber
        });
        currentIndex++;
      }
    }

    return tokens;
  }

  /**
   * Gets the language configuration
   */
  getConfiguration(): LanguageConfiguration {
    return this.config;
  }

  /**
   * Gets sorted syntax rules by priority
   */
  protected getSortedRules(): SyntaxRule[] {
    return [...this.config.syntaxRules].sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      return priorityB - priorityA;
    });
  }

  /**
   * Gets file extension from filename
   */
  protected getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot >= 0 ? fileName.substring(lastDot) : '';
  }
}
