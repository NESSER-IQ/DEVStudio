/**
 * Language service types and interfaces
 */

/**
 * Token type
 */
export enum TokenType {
  Keyword = 'keyword',
  String = 'string',
  Number = 'number',
  Comment = 'comment',
  Operator = 'operator',
  Identifier = 'identifier',
  Type = 'type',
  Function = 'function',
  Variable = 'variable',
  Constant = 'constant',
  Property = 'property',
  Parameter = 'parameter',
  Punctuation = 'punctuation',
  Whitespace = 'whitespace',
  Text = 'text'
}

/**
 * Token with position information
 */
export interface Token {
  type: TokenType;
  value: string;
  startIndex: number;
  endIndex: number;
  line: number;
}

/**
 * Syntax rule (regex-based)
 */
export interface SyntaxRule {
  pattern: RegExp;
  tokenType: TokenType;
  priority?: number;
}

/**
 * Language configuration
 */
export interface LanguageConfiguration {
  id: string;
  name: string;
  extensions: string[];
  aliases?: string[];

  // Comment configuration
  lineComment?: string;
  blockComment?: [string, string];

  // Bracket configuration
  brackets?: Array<[string, string]>;
  autoClosingPairs?: Array<{ open: string; close: string }>;
  surroundingPairs?: Array<{ open: string; close: string }>;

  // Indentation
  indentationRules?: {
    increaseIndentPattern?: RegExp;
    decreaseIndentPattern?: RegExp;
  };

  // Syntax rules
  syntaxRules: SyntaxRule[];

  // Keywords
  keywords?: string[];
  types?: string[];
  constants?: string[];
}

/**
 * Language provider interface
 */
export interface ILanguageProvider {
  // Language info
  getLanguageId(): string;
  getLanguageName(): string;
  supportsFile(fileName: string): boolean;

  // Tokenization
  tokenize(text: string): Token[];
  tokenizeLine(line: string, lineNumber: number): Token[];

  // Configuration
  getConfiguration(): LanguageConfiguration;
}

/**
 * Completion item
 */
export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
  sortText?: string;
  filterText?: string;
}

/**
 * Completion item kind
 */
export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

/**
 * Hover information
 */
export interface Hover {
  contents: string[];
  range?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

/**
 * Symbol information
 */
export interface SymbolInformation {
  name: string;
  kind: SymbolKind;
  location: {
    line: number;
    column: number;
  };
  containerName?: string;
}

/**
 * Symbol kind
 */
export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26
}
