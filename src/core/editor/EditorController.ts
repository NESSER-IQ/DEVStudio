/**
 * EditorController - Handles user interactions and commands
 * Implements the MVVM Controller layer
 */

import { EditorModel } from './EditorModel';
import { Position, Selection, EditorCommand } from './types';

/**
 * EditorController manages user interactions with the editor
 */
export class EditorController {
  private model: EditorModel;
  private commands: Map<string, EditorCommand> = new Map();
  private undoStack: any[] = [];
  private redoStack: any[] = [];

  /**
   * Creates a new EditorController
   */
  constructor(model: EditorModel) {
    this.model = model;
    this.registerBuiltInCommands();
  }

  // ===== Command Methods =====

  /**
   * Registers a command
   */
  registerCommand(command: EditorCommand): void {
    this.commands.set(command.id, command);
  }

  /**
   * Executes a command
   */
  executeCommand(commandId: string, ...args: any[]): void {
    const command = this.commands.get(commandId);
    if (!command) {
      console.warn(`Command not found: ${commandId}`);
      return;
    }

    command.handler(this, ...args);
  }

  /**
   * Gets the editor model
   */
  getModel(): EditorModel {
    return this.model;
  }

  // ===== Built-in Commands =====

  /**
   * Registers built-in editor commands
   */
  private registerBuiltInCommands(): void {
    // Cursor movement
    this.registerCommand({
      id: 'cursorUp',
      handler: (ctrl) => ctrl.moveCursor('up'),
      keybinding: 'ArrowUp'
    });

    this.registerCommand({
      id: 'cursorDown',
      handler: (ctrl) => ctrl.moveCursor('down'),
      keybinding: 'ArrowDown'
    });

    this.registerCommand({
      id: 'cursorLeft',
      handler: (ctrl) => ctrl.moveCursor('left'),
      keybinding: 'ArrowLeft'
    });

    this.registerCommand({
      id: 'cursorRight',
      handler: (ctrl) => ctrl.moveCursor('right'),
      keybinding: 'ArrowRight'
    });

    this.registerCommand({
      id: 'cursorHome',
      handler: (ctrl) => ctrl.moveCursorToLineStart(),
      keybinding: 'Home'
    });

    this.registerCommand({
      id: 'cursorEnd',
      handler: (ctrl) => ctrl.moveCursorToLineEnd(),
      keybinding: 'End'
    });

    // Text editing
    this.registerCommand({
      id: 'type',
      handler: (ctrl, text: string) => ctrl.type(text)
    });

    this.registerCommand({
      id: 'deleteLeft',
      handler: (ctrl) => ctrl.deleteLeft(),
      keybinding: 'Backspace'
    });

    this.registerCommand({
      id: 'deleteRight',
      handler: (ctrl) => ctrl.deleteRight(),
      keybinding: 'Delete'
    });

    this.registerCommand({
      id: 'newLine',
      handler: (ctrl) => ctrl.insertNewLine(),
      keybinding: 'Enter'
    });

    // Selection
    this.registerCommand({
      id: 'selectAll',
      handler: (ctrl) => ctrl.selectAll(),
      keybinding: 'Ctrl+A'
    });

    // Undo/Redo
    this.registerCommand({
      id: 'undo',
      handler: (ctrl) => ctrl.undo(),
      keybinding: 'Ctrl+Z'
    });

    this.registerCommand({
      id: 'redo',
      handler: (ctrl) => ctrl.redo(),
      keybinding: 'Ctrl+Y'
    });

    // Copy/Cut/Paste (placeholders)
    this.registerCommand({
      id: 'copy',
      handler: (ctrl) => ctrl.copy(),
      keybinding: 'Ctrl+C'
    });

    this.registerCommand({
      id: 'cut',
      handler: (ctrl) => ctrl.cut(),
      keybinding: 'Ctrl+X'
    });

    this.registerCommand({
      id: 'paste',
      handler: (ctrl) => ctrl.paste(),
      keybinding: 'Ctrl+V'
    });
  }

  // ===== Cursor Movement =====

  /**
   * Moves cursor in a direction
   */
  moveCursor(direction: 'up' | 'down' | 'left' | 'right'): void {
    const selection = this.model.getSelection();
    const position = selection.active;
    let newPosition: Position;

    switch (direction) {
      case 'up':
        newPosition = {
          line: Math.max(0, position.line - 1),
          column: position.column
        };
        break;

      case 'down':
        newPosition = {
          line: Math.min(this.model.getLineCount() - 1, position.line + 1),
          column: position.column
        };
        break;

      case 'left':
        if (position.column > 0) {
          newPosition = { line: position.line, column: position.column - 1 };
        } else if (position.line > 0) {
          const prevLine = this.model.getLine(position.line - 1);
          newPosition = { line: position.line - 1, column: prevLine.length };
        } else {
          newPosition = position;
        }
        break;

      case 'right':
        const currentLine = this.model.getLine(position.line);
        if (position.column < currentLine.length) {
          newPosition = { line: position.line, column: position.column + 1 };
        } else if (position.line < this.model.getLineCount() - 1) {
          newPosition = { line: position.line + 1, column: 0 };
        } else {
          newPosition = position;
        }
        break;

      default:
        return;
    }

    this.model.setSelection({
      start: newPosition,
      end: newPosition,
      anchor: newPosition,
      active: newPosition,
      isReversed: false
    });
  }

  /**
   * Moves cursor to line start
   */
  moveCursorToLineStart(): void {
    const selection = this.model.getSelection();
    const newPosition: Position = { line: selection.active.line, column: 0 };

    this.model.setSelection({
      start: newPosition,
      end: newPosition,
      anchor: newPosition,
      active: newPosition,
      isReversed: false
    });
  }

  /**
   * Moves cursor to line end
   */
  moveCursorToLineEnd(): void {
    const selection = this.model.getSelection();
    const line = this.model.getLine(selection.active.line);
    const newPosition: Position = { line: selection.active.line, column: line.length };

    this.model.setSelection({
      start: newPosition,
      end: newPosition,
      anchor: newPosition,
      active: newPosition,
      isReversed: false
    });
  }

  // ===== Text Editing =====

  /**
   * Types text at cursor position
   */
  type(text: string): void {
    // First delete any selected text
    const selection = this.model.getSelection();
    if (selection.start.line !== selection.end.line ||
        selection.start.column !== selection.end.column) {
      this.model.deleteSelection();
    }

    // Then insert the new text
    this.model.insertText(text);
  }

  /**
   * Deletes character to the left (Backspace)
   */
  deleteLeft(): void {
    const selection = this.model.getSelection();

    // If there's a selection, delete it
    if (selection.start.line !== selection.end.line ||
        selection.start.column !== selection.end.column) {
      this.model.deleteSelection();
      return;
    }

    // Otherwise delete one character to the left
    const position = selection.active;
    if (position.column > 0) {
      this.model.deleteText({
        start: { line: position.line, column: position.column - 1 },
        end: position
      });

      this.model.setSelection({
        start: { line: position.line, column: position.column - 1 },
        end: { line: position.line, column: position.column - 1 },
        anchor: { line: position.line, column: position.column - 1 },
        active: { line: position.line, column: position.column - 1 },
        isReversed: false
      });
    } else if (position.line > 0) {
      // Delete newline
      const prevLine = this.model.getLine(position.line - 1);
      this.model.deleteText({
        start: { line: position.line - 1, column: prevLine.length },
        end: { line: position.line, column: 0 }
      });

      this.model.setSelection({
        start: { line: position.line - 1, column: prevLine.length },
        end: { line: position.line - 1, column: prevLine.length },
        anchor: { line: position.line - 1, column: prevLine.length },
        active: { line: position.line - 1, column: prevLine.length },
        isReversed: false
      });
    }
  }

  /**
   * Deletes character to the right (Delete)
   */
  deleteRight(): void {
    const selection = this.model.getSelection();

    // If there's a selection, delete it
    if (selection.start.line !== selection.end.line ||
        selection.start.column !== selection.end.column) {
      this.model.deleteSelection();
      return;
    }

    // Otherwise delete one character to the right
    const position = selection.active;
    const line = this.model.getLine(position.line);

    if (position.column < line.length) {
      this.model.deleteText({
        start: position,
        end: { line: position.line, column: position.column + 1 }
      });
    } else if (position.line < this.model.getLineCount() - 1) {
      // Delete newline
      this.model.deleteText({
        start: position,
        end: { line: position.line + 1, column: 0 }
      });
    }
  }

  /**
   * Inserts a new line
   */
  insertNewLine(): void {
    this.type('\n');
  }

  // ===== Selection =====

  /**
   * Selects all text
   */
  selectAll(): void {
    const lastLine = this.model.getLineCount() - 1;
    const lastColumn = this.model.getLine(lastLine).length;

    this.model.setSelection({
      start: { line: 0, column: 0 },
      end: { line: lastLine, column: lastColumn },
      anchor: { line: 0, column: 0 },
      active: { line: lastLine, column: lastColumn },
      isReversed: false
    });
  }

  // ===== Undo/Redo (Placeholder) =====

  /**
   * Undo last action
   */
  undo(): void {
    // TODO: Implement undo/redo
    console.log('Undo not yet implemented');
  }

  /**
   * Redo last undone action
   */
  redo(): void {
    // TODO: Implement undo/redo
    console.log('Redo not yet implemented');
  }

  // ===== Clipboard (Placeholder) =====

  /**
   * Copy selected text
   */
  copy(): void {
    // TODO: Implement clipboard operations
    console.log('Copy not yet implemented');
  }

  /**
   * Cut selected text
   */
  cut(): void {
    // TODO: Implement clipboard operations
    console.log('Cut not yet implemented');
  }

  /**
   * Paste text from clipboard
   */
  paste(): void {
    // TODO: Implement clipboard operations
    console.log('Paste not yet implemented');
  }
}
