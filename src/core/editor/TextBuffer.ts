/**
 * TextBuffer - Efficient text storage and manipulation
 * Uses piece table or similar data structure for optimal performance
 */

import { Position, Range, LineInfo, TextChange } from './types';

/**
 * TextBuffer manages the document content efficiently
 * Uses a line-based structure for fast access and modification
 */
export class TextBuffer {
  private lines: string[] = [];
  private lineStarts: number[] = [0];
  private version: number = 0;

  /**
   * Creates a new TextBuffer
   * @param content - Initial content (optional)
   */
  constructor(content: string = '') {
    this.setText(content);
  }

  /**
   * Gets the entire text content
   */
  getText(): string {
    return this.lines.join('\n');
  }

  /**
   * Sets the entire text content
   * @param text - New text content
   */
  setText(text: string): void {
    this.lines = text.split('\n');
    this.updateLineStarts();
    this.version++;
  }

  /**
   * Gets the number of lines
   */
  getLineCount(): number {
    return this.lines.length;
  }

  /**
   * Gets a specific line
   * @param lineNumber - 0-based line number
   */
  getLine(lineNumber: number): string {
    if (lineNumber < 0 || lineNumber >= this.lines.length) {
      throw new Error(`Line number ${lineNumber} out of range`);
    }
    return this.lines[lineNumber];
  }

  /**
   * Gets line information
   * @param lineNumber - 0-based line number
   */
  getLineInfo(lineNumber: number): LineInfo {
    const text = this.getLine(lineNumber);
    return {
      lineNumber,
      text,
      length: text.length,
      startOffset: this.lineStarts[lineNumber],
      endOffset: this.lineStarts[lineNumber] + text.length
    };
  }

  /**
   * Gets text in a range
   * @param range - Range to get text from
   */
  getTextInRange(range: Range): string {
    const { start, end } = this.normalizeRange(range);

    if (start.line === end.line) {
      return this.lines[start.line].substring(start.column, end.column);
    }

    const result: string[] = [];

    // First line
    result.push(this.lines[start.line].substring(start.column));

    // Middle lines
    for (let i = start.line + 1; i < end.line; i++) {
      result.push(this.lines[i]);
    }

    // Last line
    result.push(this.lines[end.line].substring(0, end.column));

    return result.join('\n');
  }

  /**
   * Inserts text at a position
   * @param position - Position to insert at
   * @param text - Text to insert
   * @returns The change event
   */
  insertText(position: Position, text: string): TextChange {
    const pos = this.normalizePosition(position);
    const line = this.lines[pos.line];
    const before = line.substring(0, pos.column);
    const after = line.substring(pos.column);

    const newLines = text.split('\n');

    if (newLines.length === 1) {
      // Single line insert
      this.lines[pos.line] = before + text + after;
    } else {
      // Multi-line insert
      const firstLine = before + newLines[0];
      const lastLine = newLines[newLines.length - 1] + after;
      const middleLines = newLines.slice(1, -1);

      this.lines.splice(
        pos.line,
        1,
        firstLine,
        ...middleLines,
        lastLine
      );
    }

    this.updateLineStarts();
    this.version++;

    const endPosition: Position = {
      line: pos.line + newLines.length - 1,
      column: newLines.length === 1
        ? pos.column + text.length
        : newLines[newLines.length - 1].length
    };

    return {
      range: { start: pos, end: endPosition },
      text,
      rangeLength: 0
    };
  }

  /**
   * Deletes text in a range
   * @param range - Range to delete
   * @returns The change event
   */
  deleteText(range: Range): TextChange {
    const normalized = this.normalizeRange(range);
    const deletedText = this.getTextInRange(normalized);

    const startLine = this.lines[normalized.start.line];
    const endLine = this.lines[normalized.end.line];

    const before = startLine.substring(0, normalized.start.column);
    const after = endLine.substring(normalized.end.column);

    const newLine = before + after;

    this.lines.splice(
      normalized.start.line,
      normalized.end.line - normalized.start.line + 1,
      newLine
    );

    this.updateLineStarts();
    this.version++;

    return {
      range: normalized,
      text: '',
      rangeLength: deletedText.length
    };
  }

  /**
   * Replaces text in a range
   * @param range - Range to replace
   * @param text - New text
   * @returns The change event
   */
  replaceText(range: Range, text: string): TextChange {
    this.deleteText(range);
    return this.insertText(range.start, text);
  }

  /**
   * Converts offset to position
   * @param offset - Character offset
   */
  offsetToPosition(offset: number): Position {
    for (let i = 0; i < this.lineStarts.length; i++) {
      if (offset < this.lineStarts[i]) {
        return {
          line: i - 1,
          column: offset - this.lineStarts[i - 1]
        };
      }
    }

    const lastLine = this.lines.length - 1;
    return {
      line: lastLine,
      column: offset - this.lineStarts[lastLine]
    };
  }

  /**
   * Converts position to offset
   * @param position - Position
   */
  positionToOffset(position: Position): number {
    const pos = this.normalizePosition(position);
    return this.lineStarts[pos.line] + pos.column;
  }

  /**
   * Gets the current version number
   */
  getVersion(): number {
    return this.version;
  }

  /**
   * Normalizes a position to be within valid bounds
   */
  private normalizePosition(position: Position): Position {
    let line = Math.max(0, Math.min(position.line, this.lines.length - 1));
    let column = Math.max(0, Math.min(position.column, this.lines[line].length));

    return { line, column };
  }

  /**
   * Normalizes a range to be within valid bounds and properly ordered
   */
  private normalizeRange(range: Range): Range {
    const start = this.normalizePosition(range.start);
    const end = this.normalizePosition(range.end);

    // Ensure start comes before end
    if (start.line > end.line || (start.line === end.line && start.column > end.column)) {
      return { start: end, end: start };
    }

    return { start, end };
  }

  /**
   * Updates line start offsets
   */
  private updateLineStarts(): void {
    this.lineStarts = [0];
    let offset = 0;

    for (let i = 0; i < this.lines.length; i++) {
      offset += this.lines[i].length + 1; // +1 for newline
      this.lineStarts.push(offset);
    }
  }
}
