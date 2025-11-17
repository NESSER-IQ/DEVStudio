/**
 * JavaScript Hover Provider
 * Provides hover information for JavaScript code
 */

import {
  IHoverProvider,
  Hover,
  MarkupKind,
  Position
} from '../types';

/**
 * JavaScript documentation for built-in objects
 */
const JAVASCRIPT_DOCS: Record<string, string> = {
  'console.log': '```javascript\nconsole.log(...data: any[]): void\n```\n\nPrints to stdout with newline. Multiple arguments can be passed, with the first used as the primary message.',
  'console.error': '```javascript\nconsole.error(...data: any[]): void\n```\n\nPrints to stderr with newline.',
  'console.warn': '```javascript\nconsole.warn(...data: any[]): void\n```\n\nPrints a warning message.',
  'Array.map': '```javascript\nArray<T>.map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[]\n```\n\nCalls a defined callback function on each element of an array, and returns an array that contains the results.',
  'Array.filter': '```javascript\nArray<T>.filter(predicate: (value: T, index: number, array: T[]) => boolean): T[]\n```\n\nReturns the elements of an array that meet the condition specified in a callback function.',
  'Array.reduce': '```javascript\nArray<T>.reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U\n```\n\nCalls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result.',
  'Array.forEach': '```javascript\nArray<T>.forEach(callbackfn: (value: T, index: number, array: T[]) => void): void\n```\n\nPerforms the specified action for each element in an array.',
  'Array.find': '```javascript\nArray<T>.find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined\n```\n\nReturns the value of the first element in the array where predicate is true, and undefined otherwise.',
};

/**
 * JavaScript keyword documentation
 */
const KEYWORD_DOCS: Record<string, string> = {
  'function': '```javascript\nfunction name(params) { }\n```\n\nDefines a function declaration.',
  'const': '```javascript\nconst name = value\n```\n\nDeclares a block-scoped, read-only constant.',
  'let': '```javascript\nlet name = value\n```\n\nDeclares a block-scoped local variable.',
  'var': '```javascript\nvar name = value\n```\n\nDeclares a function-scoped variable.',
  'if': '```javascript\nif (condition) { }\n```\n\nExecutes a statement if a specified condition is truthy.',
  'for': '```javascript\nfor (initialization; condition; afterthought) { }\n```\n\nCreates a loop that consists of three optional expressions.',
  'while': '```javascript\nwhile (condition) { }\n```\n\nCreates a loop that executes as long as the condition is true.',
  'class': '```javascript\nclass ClassName { }\n```\n\nDefines a class declaration.',
  'async': '```javascript\nasync function name() { }\n```\n\nDefines an asynchronous function.',
  'await': '```javascript\nawait expression\n```\n\nWaits for a Promise to resolve or reject.',
  'return': '```javascript\nreturn value\n```\n\nEnds function execution and specifies a value to be returned.'
};

/**
 * JavaScript hover provider
 */
export class JavaScriptHoverProvider implements IHoverProvider {
  /**
   * Provides hover information
   */
  async provideHover(
    document: string,
    position: Position
  ): Promise<Hover | null> {
    const lines = document.split('\n');
    const line = lines[position.line] || '';

    // Get the word at position
    const word = this.getWordAtPosition(line, position.column);
    if (!word) {
      return null;
    }

    // Check for member access (e.g., console.log, array.map)
    const memberAccess = this.getMemberAccess(line, position.column);
    if (memberAccess) {
      const doc = JAVASCRIPT_DOCS[memberAccess];
      if (doc) {
        return {
          contents: {
            kind: MarkupKind.Markdown,
            value: doc
          }
        };
      }
    }

    // Check for keywords
    const keywordDoc = KEYWORD_DOCS[word];
    if (keywordDoc) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: keywordDoc
        }
      };
    }

    // Check for variable/function definitions
    const definition = this.findDefinition(document, word);
    if (definition) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: definition
        }
      };
    }

    return null;
  }

  /**
   * Gets the word at a position
   */
  private getWordAtPosition(line: string, column: number): string | null {
    if (column < 0 || column > line.length) {
      return null;
    }

    const beforeCursor = line.substring(0, column);
    const afterCursor = line.substring(column);

    const beforeMatch = beforeCursor.match(/(\w+)$/);
    const afterMatch = afterCursor.match(/^(\w+)/);

    const before = beforeMatch ? beforeMatch[1] : '';
    const after = afterMatch ? afterMatch[1] : '';

    const word = before + after;
    return word || null;
  }

  /**
   * Gets member access at position (e.g., console.log)
   */
  private getMemberAccess(line: string, column: number): string | null {
    const beforeCursor = line.substring(0, column);
    const match = beforeCursor.match(/(\w+)\.(\w+)$/);

    if (match) {
      return `${match[1]}.${match[2]}`;
    }

    return null;
  }

  /**
   * Finds definition of a symbol in the document
   */
  private findDefinition(document: string, symbol: string): string | null {
    // Find function definition
    const funcPattern = new RegExp(`function\\s+${symbol}\\s*\\([^)]*\\)`, 'i');
    const funcMatch = document.match(funcPattern);
    if (funcMatch) {
      return `\`\`\`javascript\n${funcMatch[0]}\n\`\`\`\n\nUser-defined function`;
    }

    // Find variable definition
    const varPattern = new RegExp(`(?:const|let|var)\\s+${symbol}\\s*=\\s*([^;\\n]+)`, 'i');
    const varMatch = document.match(varPattern);
    if (varMatch) {
      return `\`\`\`javascript\n${varMatch[0]}\n\`\`\`\n\nUser-defined variable`;
    }

    // Find class definition
    const classPattern = new RegExp(`class\\s+${symbol}\\s*{`, 'i');
    const classMatch = document.match(classPattern);
    if (classMatch) {
      return `\`\`\`javascript\nclass ${symbol}\n\`\`\`\n\nUser-defined class`;
    }

    return null;
  }
}
