/**
 * EditorModel - Core editor state and logic
 * Implements the MVVM Model layer
 */

import { TextBuffer } from './TextBuffer';
import {
  Position,
  Range,
  Selection,
  TextChange,
  EditorOptions,
  EditorState,
  DEFAULT_EDITOR_OPTIONS
} from './types';

/**
 * Event listener type
 */
type EventListener<T> = (data: T) => void;

/**
 * EditorModel manages the editor's state and content
 */
export class EditorModel {
  private buffer: TextBuffer;
  private selections: Selection[] = [];
  private options: EditorOptions;
  private scrollTop: number = 0;
  private scrollLeft: number = 0;
  private viewportHeight: number = 0;
  private viewportWidth: number = 0;

  // Event listeners
  private contentChangeListeners: EventListener<TextChange[]>[] = [];
  private selectionChangeListeners: EventListener<Selection[]>[] = [];
  private optionsChangeListeners: EventListener<EditorOptions>[] = [];

  /**
   * Creates a new EditorModel
   */
  constructor(content: string = '', options: Partial<EditorOptions> = {}) {
    this.buffer = new TextBuffer(content);
    this.options = { ...DEFAULT_EDITOR_OPTIONS, ...options };

    // Initialize with a single cursor at the beginning
    this.selections = [{
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 },
      anchor: { line: 0, column: 0 },
      active: { line: 0, column: 0 },
      isReversed: false
    }];
  }

  // ===== Content Methods =====

  /**
   * Gets the entire document content
   */
  getValue(): string {
    return this.buffer.getText();
  }

  /**
   * Sets the entire document content
   */
  setValue(value: string): void {
    const oldContent = this.buffer.getText();
    this.buffer.setText(value);

    const change: TextChange = {
      range: {
        start: { line: 0, column: 0 },
        end: { line: this.buffer.getLineCount() - 1, column: this.buffer.getLine(this.buffer.getLineCount() - 1).length }
      },
      text: value,
      rangeLength: oldContent.length
    };

    this.notifyContentChange([change]);

    // Reset selections
    this.setSelection({
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 },
      anchor: { line: 0, column: 0 },
      active: { line: 0, column: 0 },
      isReversed: false
    });
  }

  /**
   * Gets a specific line
   */
  getLine(lineNumber: number): string {
    return this.buffer.getLine(lineNumber);
  }

  /**
   * Gets the number of lines
   */
  getLineCount(): number {
    return this.buffer.getLineCount();
  }

  /**
   * Gets text in a range
   */
  getTextInRange(range: Range): string {
    return this.buffer.getTextInRange(range);
  }

  // ===== Selection Methods =====

  /**
   * Gets the primary selection
   */
  getSelection(): Selection {
    return this.selections[0];
  }

  /**
   * Gets all selections
   */
  getSelections(): Selection[] {
    return [...this.selections];
  }

  /**
   * Sets the primary selection
   */
  setSelection(selection: Selection): void {
    this.selections = [selection];
    this.notifySelectionChange();
  }

  /**
   * Sets multiple selections
   */
  setSelections(selections: Selection[]): void {
    if (selections.length === 0) {
      throw new Error('Must have at least one selection');
    }
    this.selections = [...selections];
    this.notifySelectionChange();
  }

  /**
   * Adds a new selection
   */
  addSelection(selection: Selection): void {
    this.selections.push(selection);
    this.notifySelectionChange();
  }

  // ===== Edit Methods =====

  /**
   * Inserts text at current cursor position(s)
   */
  insertText(text: string, position?: Position): void {
    if (position) {
      const change = this.buffer.insertText(position, text);
      this.notifyContentChange([change]);
    } else {
      const changes: TextChange[] = [];

      // Insert at each selection
      for (let i = this.selections.length - 1; i >= 0; i--) {
        const selection = this.selections[i];
        const change = this.buffer.insertText(selection.active, text);
        changes.push(change);

        // Update selection
        const newPosition = change.range.end;
        this.selections[i] = {
          start: newPosition,
          end: newPosition,
          anchor: newPosition,
          active: newPosition,
          isReversed: false
        };
      }

      this.notifyContentChange(changes);
      this.notifySelectionChange();
    }
  }

  /**
   * Deletes text in a range
   */
  deleteText(range: Range): void {
    const change = this.buffer.deleteText(range);
    this.notifyContentChange([change]);
  }

  /**
   * Replaces text in a range
   */
  replaceText(range: Range, text: string): void {
    const change = this.buffer.replaceText(range, text);
    this.notifyContentChange([change]);
  }

  /**
   * Deletes selected text
   */
  deleteSelection(): void {
    const changes: TextChange[] = [];

    for (let i = this.selections.length - 1; i >= 0; i--) {
      const selection = this.selections[i];

      if (!this.isSelectionEmpty(selection)) {
        const change = this.buffer.deleteText({
          start: selection.start,
          end: selection.end
        });
        changes.push(change);

        // Collapse selection
        this.selections[i] = {
          start: selection.start,
          end: selection.start,
          anchor: selection.start,
          active: selection.start,
          isReversed: false
        };
      }
    }

    if (changes.length > 0) {
      this.notifyContentChange(changes);
      this.notifySelectionChange();
    }
  }

  // ===== Options Methods =====

  /**
   * Gets editor options
   */
  getOptions(): EditorOptions {
    return { ...this.options };
  }

  /**
   * Sets editor options
   */
  setOptions(options: Partial<EditorOptions>): void {
    this.options = { ...this.options, ...options };
    this.notifyOptionsChange();
  }

  // ===== Viewport Methods =====

  /**
   * Gets the current scroll position
   */
  getScrollPosition(): { top: number; left: number } {
    return { top: this.scrollTop, left: this.scrollLeft };
  }

  /**
   * Sets the scroll position
   */
  setScrollPosition(top: number, left: number): void {
    this.scrollTop = top;
    this.scrollLeft = left;
  }

  /**
   * Gets viewport dimensions
   */
  getViewportDimensions(): { width: number; height: number } {
    return { width: this.viewportWidth, height: this.viewportHeight };
  }

  /**
   * Sets viewport dimensions
   */
  setViewportDimensions(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  // ===== State Methods =====

  /**
   * Gets the current editor state
   */
  getState(): EditorState {
    return {
      content: this.getValue(),
      selections: this.getSelections(),
      scrollTop: this.scrollTop,
      scrollLeft: this.scrollLeft,
      viewportHeight: this.viewportHeight,
      viewportWidth: this.viewportWidth
    };
  }

  // ===== Event Methods =====

  /**
   * Registers a content change listener
   */
  onDidChangeContent(listener: EventListener<TextChange[]>): () => void {
    this.contentChangeListeners.push(listener);
    return () => {
      const index = this.contentChangeListeners.indexOf(listener);
      if (index >= 0) {
        this.contentChangeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Registers a selection change listener
   */
  onDidChangeSelection(listener: EventListener<Selection[]>): () => void {
    this.selectionChangeListeners.push(listener);
    return () => {
      const index = this.selectionChangeListeners.indexOf(listener);
      if (index >= 0) {
        this.selectionChangeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Registers an options change listener
   */
  onDidChangeOptions(listener: EventListener<EditorOptions>): () => void {
    this.optionsChangeListeners.push(listener);
    return () => {
      const index = this.optionsChangeListeners.indexOf(listener);
      if (index >= 0) {
        this.optionsChangeListeners.splice(index, 1);
      }
    };
  }

  // ===== Helper Methods =====

  /**
   * Checks if a selection is empty (cursor)
   */
  private isSelectionEmpty(selection: Selection): boolean {
    return selection.start.line === selection.end.line &&
           selection.start.column === selection.end.column;
  }

  /**
   * Notifies content change listeners
   */
  private notifyContentChange(changes: TextChange[]): void {
    for (const listener of this.contentChangeListeners) {
      listener(changes);
    }
  }

  /**
   * Notifies selection change listeners
   */
  private notifySelectionChange(): void {
    for (const listener of this.selectionChangeListeners) {
      listener(this.getSelections());
    }
  }

  /**
   * Notifies options change listeners
   */
  private notifyOptionsChange(): void {
    for (const listener of this.optionsChangeListeners) {
      listener(this.getOptions());
    }
  }
}
