/**
 * TerminalService - خدمة الطرفية المحسّنة
 * تدعم ANSI colors وسجل الأوامر
 */

export interface TerminalLine {
  text: string;
  timestamp: number;
  type: 'command' | 'output' | 'error' | 'info';
}

export class TerminalService {
  private history: string[] = [];
  private historyIndex: number = -1;
  private maxHistorySize: number = 100;
  private outputLines: TerminalLine[] = [];
  private maxOutputLines: number = 1000;

  /**
   * Add command to history
   */
  addToHistory(command: string): void {
    if (!command.trim()) return;

    // Remove duplicate if it exists
    const existingIndex = this.history.indexOf(command);
    if (existingIndex > -1) {
      this.history.splice(existingIndex, 1);
    }

    // Add to end
    this.history.push(command);

    // Limit size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // Reset index
    this.historyIndex = this.history.length;
  }

  /**
   * Get previous command from history
   */
  getPreviousCommand(): string | null {
    if (this.history.length === 0) return null;

    if (this.historyIndex > 0) {
      this.historyIndex--;
    }

    return this.history[this.historyIndex] || null;
  }

  /**
   * Get next command from history
   */
  getNextCommand(): string | null {
    if (this.history.length === 0) return null;

    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    } else {
      this.historyIndex = this.history.length;
      return '';
    }
  }

  /**
   * Get all history
   */
  getHistory(): string[] {
    return [...this.history];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Add output line
   */
  addOutput(text: string, type: TerminalLine['type'] = 'output'): void {
    this.outputLines.push({
      text,
      timestamp: Date.now(),
      type
    });

    // Limit size
    if (this.outputLines.length > this.maxOutputLines) {
      this.outputLines.shift();
    }
  }

  /**
   * Get all output
   */
  getOutput(): TerminalLine[] {
    return [...this.outputLines];
  }

  /**
   * Get formatted output as string
   */
  getFormattedOutput(): string {
    return this.outputLines.map(line => {
      const prefix = this.getLinePrefix(line.type);
      return `${prefix}${line.text}`;
    }).join('\n');
  }

  /**
   * Clear output
   */
  clearOutput(): void {
    this.outputLines = [];
  }

  /**
   * Parse ANSI color codes and return styled text
   */
  parseAnsiColors(text: string): ParsedText[] {
    const result: ParsedText[] = [];
    const ansiRegex = /\x1b\[([0-9;]*)m/g;
    let lastIndex = 0;
    let currentColor = '';

    let match;
    while ((match = ansiRegex.exec(text)) !== null) {
      // Add text before ANSI code
      if (match.index > lastIndex) {
        result.push({
          text: text.substring(lastIndex, match.index),
          color: currentColor
        });
      }

      // Parse ANSI code
      const code = match[1];
      currentColor = this.ansiCodeToColor(code);

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push({
        text: text.substring(lastIndex),
        color: currentColor
      });
    }

    return result.length > 0 ? result : [{ text, color: '' }];
  }

  /**
   * Convert ANSI code to color
   */
  private ansiCodeToColor(code: string): string {
    const colorMap: Record<string, string> = {
      '0': '',        // Reset
      '30': '#000000', // Black
      '31': '#F48771', // Red
      '32': '#4EC9B0', // Green
      '33': '#CE9178', // Yellow
      '34': '#569CD6', // Blue
      '35': '#C586C0', // Magenta
      '36': '#4EC9B0', // Cyan
      '37': '#D4D4D4', // White
      '90': '#6A6A6A', // Bright Black (Gray)
      '91': '#F14C4C', // Bright Red
      '92': '#23D18B', // Bright Green
      '93': '#F5F543', // Bright Yellow
      '94': '#3B8EEA', // Bright Blue
      '95': '#D670D6', // Bright Magenta
      '96': '#29B8DB', // Bright Cyan
      '97': '#FFFFFF'  // Bright White
    };

    return colorMap[code] || '';
  }

  /**
   * Get line prefix based on type
   */
  private getLinePrefix(type: TerminalLine['type']): string {
    switch (type) {
      case 'command':
        return '$ ';
      case 'error':
        return '❌ ';
      case 'info':
        return 'ℹ️  ';
      case 'output':
      default:
        return '';
    }
  }

  /**
   * Get common command suggestions
   */
  getSuggestions(partial: string): string[] {
    const commonCommands = [
      'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'echo',
      'git init', 'git clone', 'git add', 'git commit', 'git push',
      'git pull', 'git status', 'git log', 'git branch', 'git checkout',
      'npm install', 'npm run', 'npm start', 'npm test',
      'hvigorw assembleDebug', 'hvigorw assembleRelease',
      'clear', 'help', 'exit'
    ];

    if (!partial) return [];

    return commonCommands.filter(cmd =>
      cmd.toLowerCase().startsWith(partial.toLowerCase())
    );
  }
}

export interface ParsedText {
  text: string;
  color: string;
}

// Singleton instance
export const terminalService = new TerminalService();
