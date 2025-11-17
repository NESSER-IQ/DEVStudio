/**
 * IntelliSense types and interfaces
 * Advanced code intelligence features
 */

import { Position } from '../editor/types';

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
 * Completion item
 */
export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  sortText?: string;
  filterText?: string;
  insertText?: string;
  insertTextFormat?: InsertTextFormat;
  additionalTextEdits?: TextEdit[];
  command?: Command;
  data?: any;
}

/**
 * Insert text format
 */
export enum InsertTextFormat {
  PlainText = 1,
  Snippet = 2
}

/**
 * Text edit
 */
export interface TextEdit {
  range: {
    start: Position;
    end: Position;
  };
  newText: string;
}

/**
 * Command
 */
export interface Command {
  title: string;
  command: string;
  arguments?: any[];
}

/**
 * Completion context
 */
export interface CompletionContext {
  triggerKind: CompletionTriggerKind;
  triggerCharacter?: string;
}

/**
 * Completion trigger kind
 */
export enum CompletionTriggerKind {
  Invoked = 1,
  TriggerCharacter = 2,
  TriggerForIncompleteCompletions = 3
}

/**
 * Completion provider interface
 */
export interface ICompletionProvider {
  /**
   * Provides completion items
   */
  provideCompletionItems(
    document: string,
    position: Position,
    context: CompletionContext
  ): CompletionItem[] | Promise<CompletionItem[]>;

  /**
   * Resolves additional information for a completion item
   */
  resolveCompletionItem?(item: CompletionItem): CompletionItem | Promise<CompletionItem>;

  /**
   * Trigger characters
   */
  triggerCharacters?: string[];
}

/**
 * Hover information
 */
export interface Hover {
  contents: MarkupContent | string[];
  range?: {
    start: Position;
    end: Position;
  };
}

/**
 * Markup content
 */
export interface MarkupContent {
  kind: MarkupKind;
  value: string;
}

/**
 * Markup kind
 */
export enum MarkupKind {
  PlainText = 'plaintext',
  Markdown = 'markdown'
}

/**
 * Hover provider interface
 */
export interface IHoverProvider {
  /**
   * Provides hover information
   */
  provideHover(
    document: string,
    position: Position
  ): Hover | null | Promise<Hover | null>;
}

/**
 * Signature help
 */
export interface SignatureHelp {
  signatures: SignatureInformation[];
  activeSignature: number;
  activeParameter: number;
}

/**
 * Signature information
 */
export interface SignatureInformation {
  label: string;
  documentation?: string | MarkupContent;
  parameters?: ParameterInformation[];
}

/**
 * Parameter information
 */
export interface ParameterInformation {
  label: string | [number, number];
  documentation?: string | MarkupContent;
}

/**
 * Signature help provider interface
 */
export interface ISignatureHelpProvider {
  /**
   * Provides signature help
   */
  provideSignatureHelp(
    document: string,
    position: Position
  ): SignatureHelp | null | Promise<SignatureHelp | null>;

  /**
   * Trigger characters
   */
  triggerCharacters?: string[];

  /**
   * Retrigger characters
   */
  retriggerCharacters?: string[];
}

/**
 * Definition location
 */
export interface Location {
  uri: string;
  range: {
    start: Position;
    end: Position;
  };
}

/**
 * Definition provider interface
 */
export interface IDefinitionProvider {
  /**
   * Provides definition location(s)
   */
  provideDefinition(
    document: string,
    position: Position
  ): Location | Location[] | null | Promise<Location | Location[] | null>;
}

/**
 * Reference context
 */
export interface ReferenceContext {
  includeDeclaration: boolean;
}

/**
 * Reference provider interface
 */
export interface IReferenceProvider {
  /**
   * Provides reference locations
   */
  provideReferences(
    document: string,
    position: Position,
    context: ReferenceContext
  ): Location[] | null | Promise<Location[] | null>;
}

/**
 * Document symbol
 */
export interface DocumentSymbol {
  name: string;
  detail?: string;
  kind: SymbolKind;
  range: {
    start: Position;
    end: Position;
  };
  selectionRange: {
    start: Position;
    end: Position;
  };
  children?: DocumentSymbol[];
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

/**
 * Document symbol provider interface
 */
export interface IDocumentSymbolProvider {
  /**
   * Provides document symbols
   */
  provideDocumentSymbols(
    document: string
  ): DocumentSymbol[] | null | Promise<DocumentSymbol[] | null>;
}
