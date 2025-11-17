/**
 * Python Language Provider
 */

import { LanguageConfiguration, TokenType } from '../types';
import { LanguageProvider } from '../LanguageProvider';

/**
 * Python keywords
 */
const PYTHON_KEYWORDS = [
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
  'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
];

/**
 * Python built-in constants
 */
const PYTHON_CONSTANTS = [
  'True', 'False', 'None', 'NotImplemented', 'Ellipsis', '__debug__'
];

/**
 * Python built-in functions
 */
const PYTHON_BUILTINS = [
  'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
  'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr',
  'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
  'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
  'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
  'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max',
  'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord',
  'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round',
  'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
  'super', 'tuple', 'type', 'vars', 'zip'
];

/**
 * Python language configuration
 */
const pythonConfig: LanguageConfiguration = {
  id: 'python',
  name: 'Python',
  extensions: ['.py', '.pyw', '.pyi'],
  aliases: ['py', 'python'],

  lineComment: '#',

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
    { open: "'", close: "'" }
  ],

  keywords: PYTHON_KEYWORDS,
  constants: PYTHON_CONSTANTS,

  syntaxRules: [
    // Comments
    {
      pattern: /#.*$/,
      tokenType: TokenType.Comment,
      priority: 10
    },

    // Triple-quoted strings (docstrings)
    {
      pattern: /"""[\s\S]*?"""/,
      tokenType: TokenType.String,
      priority: 10
    },
    {
      pattern: /'''[\s\S]*?'''/,
      tokenType: TokenType.String,
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

    // Raw strings
    {
      pattern: /r"(?:\\.|[^"\\])*"/,
      tokenType: TokenType.String,
      priority: 9
    },
    {
      pattern: /r'(?:\\.|[^'\\])*'/,
      tokenType: TokenType.String,
      priority: 9
    },

    // F-strings
    {
      pattern: /f"(?:\\.|[^"\\])*"/,
      tokenType: TokenType.String,
      priority: 9
    },
    {
      pattern: /f'(?:\\.|[^'\\])*'/,
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
      pattern: new RegExp(`\\b(${PYTHON_KEYWORDS.join('|')})\\b`),
      tokenType: TokenType.Keyword,
      priority: 7
    },

    // Constants
    {
      pattern: new RegExp(`\\b(${PYTHON_CONSTANTS.join('|')})\\b`),
      tokenType: TokenType.Constant,
      priority: 7
    },

    // Built-in functions
    {
      pattern: new RegExp(`\\b(${PYTHON_BUILTINS.join('|')})(?=\\s*\\()`),
      tokenType: TokenType.Function,
      priority: 7
    },

    // Function definitions
    {
      pattern: /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      tokenType: TokenType.Function,
      priority: 7
    },

    // Class definitions
    {
      pattern: /\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      tokenType: TokenType.Type,
      priority: 7
    },

    // Decorators
    {
      pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/,
      tokenType: TokenType.Function,
      priority: 6
    },

    // Function calls
    {
      pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/,
      tokenType: TokenType.Function,
      priority: 6
    },

    // Identifiers
    {
      pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
      tokenType: TokenType.Identifier,
      priority: 5
    },

    // Operators
    {
      pattern: /[+\-*/%<>=!&|^~@]+|\/\/|\*\*|<<|>>|<=|>=|==|!=|:=/,
      tokenType: TokenType.Operator,
      priority: 4
    },

    // Punctuation
    {
      pattern: /[{}()\[\];:,.]/,
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
 * Python language provider
 */
export class PythonLanguageProvider extends LanguageProvider {
  constructor() {
    super(pythonConfig);
  }
}
