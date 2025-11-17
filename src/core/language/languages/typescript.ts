/**
 * TypeScript Language Provider
 */

import { LanguageConfiguration, TokenType } from '../types';
import { LanguageProvider } from '../LanguageProvider';

/**
 * TypeScript keywords (includes JavaScript keywords + TypeScript-specific)
 */
const TYPESCRIPT_KEYWORDS = [
  // JavaScript keywords
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
  'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
  'void', 'while', 'with', 'yield', 'async', 'await', 'of', 'static',
  'get', 'set',
  // TypeScript-specific
  'abstract', 'as', 'asserts', 'any', 'boolean', 'constructor', 'declare',
  'enum', 'from', 'implements', 'interface', 'is', 'keyof', 'module',
  'namespace', 'never', 'number', 'object', 'package', 'private', 'protected',
  'public', 'readonly', 'require', 'string', 'symbol', 'type', 'undefined',
  'unique', 'unknown'
];

/**
 * TypeScript types
 */
const TYPESCRIPT_TYPES = [
  'string', 'number', 'boolean', 'any', 'void', 'never', 'unknown',
  'object', 'symbol', 'bigint', 'undefined', 'null'
];

/**
 * TypeScript constants
 */
const TYPESCRIPT_CONSTANTS = [
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'
];

/**
 * TypeScript language configuration
 */
const typescriptConfig: LanguageConfiguration = {
  id: 'typescript',
  name: 'TypeScript',
  extensions: ['.ts', '.tsx', '.ets'],
  aliases: ['ts', 'typescript'],

  lineComment: '//',
  blockComment: ['/*', '*/'],

  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    ['<', '>']
  ],

  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' }
  ],

  keywords: TYPESCRIPT_KEYWORDS,
  types: TYPESCRIPT_TYPES,
  constants: TYPESCRIPT_CONSTANTS,

  syntaxRules: [
    // Comments
    {
      pattern: /\/\/.*$/,
      tokenType: TokenType.Comment,
      priority: 10
    },
    {
      pattern: /\/\*[\s\S]*?\*\//,
      tokenType: TokenType.Comment,
      priority: 10
    },

    // Strings
    {
      pattern: /"(?:\\.|[^"\\])*"/,
      tokenType: TokenType.String,
      priority: 9
    },
    {
      pattern: /'(?:\\.|[^'\\])*'/,
      tokenType: TokenType.String,
      priority: 9
    },
    {
      pattern: /`(?:\\.|[^`\\])*`/,
      tokenType: TokenType.String,
      priority: 9
    },

    // Numbers
    {
      pattern: /\b0[xX][0-9a-fA-F]+n?\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b0[oO][0-7]+n?\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b0[bB][01]+n?\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b\d+\.?\d*([eE][+-]?\d+)?n?\b/,
      tokenType: TokenType.Number,
      priority: 8
    },

    // Types
    {
      pattern: new RegExp(`\\b(${TYPESCRIPT_TYPES.join('|')})\\b`),
      tokenType: TokenType.Type,
      priority: 7
    },

    // Keywords
    {
      pattern: new RegExp(`\\b(${TYPESCRIPT_KEYWORDS.join('|')})\\b`),
      tokenType: TokenType.Keyword,
      priority: 7
    },

    // Constants
    {
      pattern: new RegExp(`\\b(${TYPESCRIPT_CONSTANTS.join('|')})\\b`),
      tokenType: TokenType.Constant,
      priority: 7
    },

    // Function calls
    {
      pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/,
      tokenType: TokenType.Function,
      priority: 6
    },

    // Type annotations (after colon)
    {
      pattern: /:\s*[a-zA-Z_$][a-zA-Z0-9_$]*/,
      tokenType: TokenType.Type,
      priority: 6
    },

    // Identifiers
    {
      pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/,
      tokenType: TokenType.Identifier,
      priority: 5
    },

    // Operators
    {
      pattern: /[+\-*/%<>=!&|^~?:]+/,
      tokenType: TokenType.Operator,
      priority: 4
    },

    // Punctuation
    {
      pattern: /[{}()\[\];,.]/,
      tokenType: TokenType.Punctuation,
      priority: 3
    },

    // Whitespace
    {
      pattern: /\s+/,
      tokenType: TokenType.Whitespace,
      priority: 1
    }
  ]
};

/**
 * TypeScript language provider
 */
export class TypeScriptLanguageProvider extends LanguageProvider {
  constructor() {
    super(typescriptConfig);
  }
}
