/**
 * Core editor types and interfaces
 * Defines fundamental data structures for the code editor
 */

/**
 * Position in the text buffer
 */
export interface Position {
  line: number;      // 0-based line number
  column: number;    // 0-based column number
}

/**
 * Range in the text buffer
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Text selection
 */
export interface Selection extends Range {
  anchor: Position;  // Where selection started
  active: Position;  // Current cursor position
  isReversed: boolean;
}

/**
 * Text change event
 */
export interface TextChange {
  range: Range;
  text: string;
  rangeLength: number;
}

/**
 * Editor configuration options
 */
export interface EditorOptions {
  tabSize: number;
  insertSpaces: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  wordWrap: boolean;
  fontSize: number;
  fontFamily: string;
  theme: string;
  readOnly: boolean;
  renderWhitespace: boolean;
  renderControlCharacters: boolean;
  rulers: number[];
}

/**
 * Editor state
 */
export interface EditorState {
  content: string;
  selections: Selection[];
  scrollTop: number;
  scrollLeft: number;
  viewportHeight: number;
  viewportWidth: number;
}

/**
 * Line information
 */
export interface LineInfo {
  lineNumber: number;
  text: string;
  length: number;
  startOffset: number;
  endOffset: number;
}

/**
 * Token for syntax highlighting
 */
export interface Token {
  type: string;
  startColumn: number;
  endColumn: number;
}

/**
 * Line tokens
 */
export interface LineTokens {
  lineNumber: number;
  tokens: Token[];
}

/**
 * Editor command
 */
export interface EditorCommand {
  id: string;
  handler: (editor: IEditor, ...args: any[]) => void;
  keybinding?: string;
}

/**
 * Editor instance interface
 */
export interface IEditor {
  // Content methods
  getValue(): string;
  setValue(value: string): void;
  getLine(lineNumber: number): string;
  getLineCount(): number;

  // Selection methods
  getSelection(): Selection;
  getSelections(): Selection[];
  setSelection(selection: Selection): void;
  setSelections(selections: Selection[]): void;

  // Edit methods
  insertText(text: string, position?: Position): void;
  deleteText(range: Range): void;
  replaceText(range: Range, text: string): void;

  // Options
  getOptions(): EditorOptions;
  setOptions(options: Partial<EditorOptions>): void;

  // Commands
  executeCommand(commandId: string, ...args: any[]): void;
  registerCommand(command: EditorCommand): void;

  // Events
  onDidChangeContent(listener: (changes: TextChange[]) => void): void;
  onDidChangeSelection(listener: (selections: Selection[]) => void): void;
}

/**
 * Default editor options
 */
export const DEFAULT_EDITOR_OPTIONS: EditorOptions = {
  tabSize: 2,
  insertSpaces: true,
  lineNumbers: true,
  minimap: true,
  wordWrap: false,
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  theme: 'light',
  readOnly: false,
  renderWhitespace: false,
  renderControlCharacters: false,
  rulers: []
};
