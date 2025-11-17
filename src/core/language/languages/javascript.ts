/**
 * JavaScript Language Provider
 */

import { LanguageConfiguration, TokenType } from '../types';
import { LanguageProvider } from '../LanguageProvider';

/**
 * JavaScript keywords
 */
const JAVASCRIPT_KEYWORDS = [
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
  'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
  'void', 'while', 'with', 'yield', 'async', 'await', 'of', 'static',
  'get', 'set'
];

/**
 * JavaScript constants
 */
const JAVASCRIPT_CONSTANTS = [
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'
];

/**
 * JavaScript language configuration
 */
const javascriptConfig: LanguageConfiguration = {
  id: 'javascript',
  name: 'JavaScript',
  extensions: ['.js', '.jsx', '.mjs', '.cjs'],
  aliases: ['js', 'javascript'],

  lineComment: '//',
  blockComment: ['/*', '*/'],

  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],

  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' }
  ],

  keywords: JAVASCRIPT_KEYWORDS,
  constants: JAVASCRIPT_CONSTANTS,

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
      pattern: /\b0[xX][0-9a-fA-F]+\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b0[oO][0-7]+\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b0[bB][01]+\b/,
      tokenType: TokenType.Number,
      priority: 8
    },
    {
      pattern: /\b\d+\.?\d*([eE][+-]?\d+)?\b/,
      tokenType: TokenType.Number,
      priority: 8
    },

    // Keywords
    {
      pattern: new RegExp(`\\b(${JAVASCRIPT_KEYWORDS.join('|')})\\b`),
      tokenType: TokenType.Keyword,
      priority: 7
    },

    // Constants
    {
      pattern: new RegExp(`\\b(${JAVASCRIPT_CONSTANTS.join('|')})\\b`),
      tokenType: TokenType.Constant,
      priority: 7
    },

    // Function calls
    {
      pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/,
      tokenType: TokenType.Function,
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
 * JavaScript language provider
 */
export class JavaScriptLanguageProvider extends LanguageProvider {
  constructor() {
    super(javascriptConfig);
  }
}
