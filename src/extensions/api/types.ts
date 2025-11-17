/**
 * Extension API types and interfaces
 * Core APIs exposed to extensions
 */

import { Position, Range, Selection } from '../../core/editor/types';
import { CompletionItem, Hover } from '../../core/intellisense/types';

/**
 * Extension manifest
 */
export interface ExtensionManifest {
  name: string;
  displayName: string;
  version: string;
  publisher: string;
  description: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
  keywords?: string[];
  categories?: string[];

  // Extension entry points
  main?: string;
  activationEvents?: string[];

  // Contributions
  contributes?: {
    commands?: CommandContribution[];
    languages?: LanguageContribution[];
    themes?: ThemeContribution[];
    snippets?: SnippetContribution[];
    keybindings?: KeybindingContribution[];
    menus?: MenuContribution[];
  };

  // Dependencies
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;

  // Engine compatibility
  engines?: {
    harmonyos?: string;
  };
}

/**
 * Command contribution
 */
export interface CommandContribution {
  command: string;
  title: string;
  category?: string;
  icon?: string;
}

/**
 * Language contribution
 */
export interface LanguageContribution {
  id: string;
  extensions: string[];
  aliases?: string[];
  configuration?: string;
}

/**
 * Theme contribution
 */
export interface ThemeContribution {
  id: string;
  label: string;
  uiTheme: 'light' | 'dark';
  path: string;
}

/**
 * Snippet contribution
 */
export interface SnippetContribution {
  language: string;
  path: string;
}

/**
 * Keybinding contribution
 */
export interface KeybindingContribution {
  command: string;
  key: string;
  when?: string;
}

/**
 * Menu contribution
 */
export interface MenuContribution {
  commandPalette?: MenuItemContribution[];
  editor?: MenuItemContribution[];
}

/**
 * Menu item contribution
 */
export interface MenuItemContribution {
  command: string;
  when?: string;
  group?: string;
}

/**
 * Extension context
 */
export interface ExtensionContext {
  /**
   * Extension manifest
   */
  readonly manifest: ExtensionManifest;

  /**
   * Extension path
   */
  readonly extensionPath: string;

  /**
   * Subscriptions for disposal
   */
  subscriptions: Disposable[];

  /**
   * Global state storage
   */
  globalState: Memento;

  /**
   * Workspace state storage
   */
  workspaceState: Memento;

  /**
   * Extension-specific storage path
   */
  readonly storagePath: string | undefined;

  /**
   * Global storage path
   */
  readonly globalStoragePath: string | undefined;
}

/**
 * Disposable interface
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Memento (state storage)
 */
export interface Memento {
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  update(key: string, value: any): Promise<void>;
}

/**
 * Extension mode
 */
export enum ExtensionMode {
  Production = 1,
  Development = 2,
  Test = 3
}

/**
 * Extension kind
 */
export enum ExtensionKind {
  UI = 1,
  Workspace = 2
}

/**
 * Extension activation function
 */
export type ExtensionActivate = (context: ExtensionContext) => void | Promise<void>;

/**
 * Extension deactivation function
 */
export type ExtensionDeactivate = () => void | Promise<void>;

/**
 * Extension export
 */
export interface Extension {
  activate: ExtensionActivate;
  deactivate?: ExtensionDeactivate;
}

/**
 * Extension information
 */
export interface ExtensionInfo {
  id: string;
  manifest: ExtensionManifest;
  extensionPath: string;
  isActive: boolean;
  exports?: any;
}

/**
 * Command handler
 */
export type CommandHandler = (...args: any[]) => any;

/**
 * Output channel
 */
export interface OutputChannel {
  name: string;
  append(value: string): void;
  appendLine(value: string): void;
  clear(): void;
  show(preserveFocus?: boolean): void;
  hide(): void;
  dispose(): void;
}

/**
 * Message options
 */
export interface MessageOptions {
  modal?: boolean;
}

/**
 * Message item
 */
export interface MessageItem {
  title: string;
  isCloseAffordance?: boolean;
}

/**
 * Input box options
 */
export interface InputBoxOptions {
  value?: string;
  valueSelection?: [number, number];
  prompt?: string;
  placeHolder?: string;
  password?: boolean;
  ignoreFocusOut?: boolean;
  validateInput?(value: string): string | undefined | null | Promise<string | undefined | null>;
}

/**
 * Quick pick item
 */
export interface QuickPickItem {
  label: string;
  description?: string;
  detail?: string;
  picked?: boolean;
  alwaysShow?: boolean;
}

/**
 * Quick pick options
 */
export interface QuickPickOptions {
  placeHolder?: string;
  canPickMany?: boolean;
  ignoreFocusOut?: boolean;
  matchOnDescription?: boolean;
  matchOnDetail?: boolean;
}

/**
 * Text document
 */
export interface TextDocument {
  readonly uri: string;
  readonly fileName: string;
  readonly isUntitled: boolean;
  readonly languageId: string;
  readonly version: number;
  readonly isDirty: boolean;
  readonly isClosed: boolean;

  save(): Promise<boolean>;
  getText(range?: Range): string;
  getWordRangeAtPosition(position: Position): Range | undefined;
  lineAt(line: number): TextLine;
  positionAt(offset: number): Position;
  offsetAt(position: Position): number;
}

/**
 * Text line
 */
export interface TextLine {
  readonly lineNumber: number;
  readonly text: string;
  readonly range: Range;
  readonly rangeIncludingLineBreak: Range;
  readonly firstNonWhitespaceCharacterIndex: number;
  readonly isEmptyOrWhitespace: boolean;
}

/**
 * Text editor
 */
export interface TextEditor {
  readonly document: TextDocument;
  selection: Selection;
  selections: Selection[];
  readonly visibleRanges: Range[];
  options: TextEditorOptions;

  edit(callback: (editBuilder: TextEditorEdit) => void): Promise<boolean>;
  setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[]): void;
  revealRange(range: Range, revealType?: TextEditorRevealType): void;
}

/**
 * Text editor options
 */
export interface TextEditorOptions {
  tabSize?: number;
  insertSpaces?: boolean;
  cursorStyle?: number;
  lineNumbers?: boolean;
}

/**
 * Text editor edit
 */
export interface TextEditorEdit {
  replace(location: Position | Range | Selection, value: string): void;
  insert(location: Position, value: string): void;
  delete(location: Range | Selection): void;
}

/**
 * Text editor decoration type
 */
export interface TextEditorDecorationType {
  key: string;
  dispose(): void;
}

/**
 * Text editor reveal type
 */
export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

/**
 * Decoration render options
 */
export interface DecorationRenderOptions {
  backgroundColor?: string;
  border?: string;
  borderColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  color?: string;
  cursor?: string;
  fontStyle?: string;
  fontWeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  opacity?: string;
  outline?: string;
  outlineColor?: string;
  outlineWidth?: string;
}
