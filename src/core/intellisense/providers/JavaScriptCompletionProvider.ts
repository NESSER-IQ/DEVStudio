/**
 * JavaScript Completion Provider
 * Provides IntelliSense for JavaScript
 */

import {
  ICompletionProvider,
  CompletionItem,
  CompletionItemKind,
  CompletionContext,
  Position
} from '../types';

/**
 * JavaScript built-in objects and their methods
 */
const JAVASCRIPT_GLOBALS: Record<string, CompletionItem[]> = {
  'console': [
    {
      label: 'log',
      kind: CompletionItemKind.Method,
      detail: '(method) console.log(...data: any[]): void',
      documentation: 'Prints to stdout with newline',
      insertText: 'log($1)',
      insertTextFormat: 2 // Snippet
    },
    {
      label: 'error',
      kind: CompletionItemKind.Method,
      detail: '(method) console.error(...data: any[]): void',
      documentation: 'Prints to stderr with newline',
      insertText: 'error($1)',
      insertTextFormat: 2
    },
    {
      label: 'warn',
      kind: CompletionItemKind.Method,
      detail: '(method) console.warn(...data: any[]): void',
      documentation: 'Prints warning message',
      insertText: 'warn($1)',
      insertTextFormat: 2
    },
    {
      label: 'info',
      kind: CompletionItemKind.Method,
      detail: '(method) console.info(...data: any[]): void',
      documentation: 'Prints informational message',
      insertText: 'info($1)',
      insertTextFormat: 2
    }
  ],
  'Array': [
    {
      label: 'map',
      kind: CompletionItemKind.Method,
      detail: '(method) Array<T>.map<U>(callbackfn: (value: T) => U): U[]',
      documentation: 'Calls a defined callback function on each element',
      insertText: 'map($1)',
      insertTextFormat: 2
    },
    {
      label: 'filter',
      kind: CompletionItemKind.Method,
      detail: '(method) Array<T>.filter(callbackfn: (value: T) => boolean): T[]',
      documentation: 'Returns elements that meet the condition',
      insertText: 'filter($1)',
      insertTextFormat: 2
    },
    {
      label: 'reduce',
      kind: CompletionItemKind.Method,
      detail: '(method) Array<T>.reduce<U>(callbackfn: (acc: U, value: T) => U, initial: U): U',
      documentation: 'Reduces the array to a single value',
      insertText: 'reduce($1)',
      insertTextFormat: 2
    },
    {
      label: 'forEach',
      kind: CompletionItemKind.Method,
      detail: '(method) Array<T>.forEach(callbackfn: (value: T) => void): void',
      documentation: 'Performs the specified action for each element',
      insertText: 'forEach($1)',
      insertTextFormat: 2
    },
    {
      label: 'find',
      kind: CompletionItemKind.Method,
      detail: '(method) Array<T>.find(predicate: (value: T) => boolean): T | undefined',
      documentation: 'Returns the first element that matches',
      insertText: 'find($1)',
      insertTextFormat: 2
    }
  ]
};

/**
 * JavaScript keywords
 */
const JAVASCRIPT_KEYWORDS: CompletionItem[] = [
  {
    label: 'function',
    kind: CompletionItemKind.Keyword,
    detail: 'Function declaration',
    insertText: 'function ${1:name}(${2:params}) {\n\t$3\n}',
    insertTextFormat: 2
  },
  {
    label: 'const',
    kind: CompletionItemKind.Keyword,
    detail: 'Constant declaration',
    insertText: 'const ${1:name} = $2',
    insertTextFormat: 2
  },
  {
    label: 'let',
    kind: CompletionItemKind.Keyword,
    detail: 'Variable declaration',
    insertText: 'let ${1:name} = $2',
    insertTextFormat: 2
  },
  {
    label: 'var',
    kind: CompletionItemKind.Keyword,
    detail: 'Variable declaration',
    insertText: 'var ${1:name} = $2',
    insertTextFormat: 2
  },
  {
    label: 'if',
    kind: CompletionItemKind.Keyword,
    detail: 'If statement',
    insertText: 'if (${1:condition}) {\n\t$2\n}',
    insertTextFormat: 2
  },
  {
    label: 'for',
    kind: CompletionItemKind.Keyword,
    detail: 'For loop',
    insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t$3\n}',
    insertTextFormat: 2
  },
  {
    label: 'while',
    kind: CompletionItemKind.Keyword,
    detail: 'While loop',
    insertText: 'while (${1:condition}) {\n\t$2\n}',
    insertTextFormat: 2
  },
  {
    label: 'class',
    kind: CompletionItemKind.Keyword,
    detail: 'Class declaration',
    insertText: 'class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t$3\n\t}\n}',
    insertTextFormat: 2
  },
  {
    label: 'async',
    kind: CompletionItemKind.Keyword,
    detail: 'Async function',
    insertText: 'async function ${1:name}(${2:params}) {\n\t$3\n}',
    insertTextFormat: 2
  },
  {
    label: 'await',
    kind: CompletionItemKind.Keyword,
    detail: 'Await expression',
    insertText: 'await $1',
    insertTextFormat: 2
  },
  {
    label: 'try',
    kind: CompletionItemKind.Keyword,
    detail: 'Try-catch block',
    insertText: 'try {\n\t$1\n} catch (${2:error}) {\n\t$3\n}',
    insertTextFormat: 2
  },
  {
    label: 'return',
    kind: CompletionItemKind.Keyword,
    detail: 'Return statement',
    insertText: 'return $1',
    insertTextFormat: 2
  }
];

/**
 * JavaScript completion provider
 */
export class JavaScriptCompletionProvider implements ICompletionProvider {
  triggerCharacters = ['.', '('];

  /**
   * Provides completion items
   */
  async provideCompletionItems(
    document: string,
    position: Position,
    context: CompletionContext
  ): Promise<CompletionItem[]> {
    const items: CompletionItem[] = [];

    // Get the line up to the cursor
    const lines = document.split('\n');
    const line = lines[position.line] || '';
    const textBeforeCursor = line.substring(0, position.column);

    // Check if we're after a dot (member access)
    if (context.triggerCharacter === '.') {
      const memberItems = this.getMemberCompletions(textBeforeCursor);
      items.push(...memberItems);
    } else {
      // General completions (keywords, globals, etc.)
      items.push(...JAVASCRIPT_KEYWORDS);
      items.push(...this.getGlobalCompletions());
      items.push(...this.getVariableCompletions(document, position));
    }

    return items;
  }

  /**
   * Gets member completions (after dot)
   */
  private getMemberCompletions(textBeforeCursor: string): CompletionItem[] {
    const match = textBeforeCursor.match(/(\w+)\.$/);
    if (!match) {
      return [];
    }

    const objectName = match[1];

    // Check if it's a known global object
    if (JAVASCRIPT_GLOBALS[objectName]) {
      return JAVASCRIPT_GLOBALS[objectName];
    }

    // Check if it's an array
    if (this.isArray(objectName, textBeforeCursor)) {
      return JAVASCRIPT_GLOBALS['Array'] || [];
    }

    return [];
  }

  /**
   * Gets global completions
   */
  private getGlobalCompletions(): CompletionItem[] {
    const items: CompletionItem[] = [];

    // Add global objects
    for (const name of Object.keys(JAVASCRIPT_GLOBALS)) {
      items.push({
        label: name,
        kind: CompletionItemKind.Variable,
        detail: `(global) ${name}`,
        documentation: `Global ${name} object`
      });
    }

    return items;
  }

  /**
   * Gets variable completions from document
   */
  private getVariableCompletions(
    document: string,
    position: Position
  ): CompletionItem[] {
    const items: CompletionItem[] = [];
    const seen = new Set<string>();

    // Find all variable declarations
    const varPattern = /\b(?:const|let|var)\s+(\w+)/g;
    const funcPattern = /\bfunction\s+(\w+)/g;
    const classPattern = /\bclass\s+(\w+)/g;

    // Find variables
    let match: RegExpExecArray | null;
    while ((match = varPattern.exec(document)) !== null) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        items.push({
          label: name,
          kind: CompletionItemKind.Variable,
          detail: '(variable)',
          documentation: `Variable ${name}`
        });
      }
    }

    // Find functions
    while ((match = funcPattern.exec(document)) !== null) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        items.push({
          label: name,
          kind: CompletionItemKind.Function,
          detail: '(function)',
          documentation: `Function ${name}`
        });
      }
    }

    // Find classes
    while ((match = classPattern.exec(document)) !== null) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        items.push({
          label: name,
          kind: CompletionItemKind.Class,
          detail: '(class)',
          documentation: `Class ${name}`
        });
      }
    }

    return items;
  }

  /**
   * Checks if a variable is likely an array
   */
  private isArray(name: string, context: string): boolean {
    // Simple heuristic: check if the variable name suggests an array
    const arrayPatterns = [
      /\b\w+s\b/,  // Plural names
      /\barray\b/i,
      /\blist\b/i,
      /\bitems\b/i
    ];

    for (const pattern of arrayPatterns) {
      if (pattern.test(name)) {
        return true;
      }
    }

    // Check if assigned from array literal or Array constructor
    const assignPattern = new RegExp(`\\b${name}\\s*=\\s*\\[|new Array`, 'i');
    return assignPattern.test(context);
  }
}
