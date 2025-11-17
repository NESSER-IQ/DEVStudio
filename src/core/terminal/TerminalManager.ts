/**
 * TerminalManager - Manages multiple terminals
 */

import {
  ITerminalManager,
  ITerminal,
  TerminalOptions
} from './types';
import { Terminal } from './Terminal';

/**
 * TerminalManager implementation
 */
export class TerminalManager implements ITerminalManager {
  private terminals: Map<string, ITerminal> = new Map();
  private nextId: number = 1;

  private createListeners: Array<(terminal: ITerminal) => void> = [];
  private disposeListeners: Array<(terminal: ITerminal) => void> = [];

  /**
   * Creates a new terminal
   */
  createTerminal(options: TerminalOptions = {}): ITerminal {
    const id = `terminal-${this.nextId++}`;
    const terminal = new Terminal(id, options);

    this.terminals.set(id, terminal);
    this.notifyCreate(terminal);

    // Auto-cleanup on exit
    terminal.onExit(() => {
      setTimeout(() => {
        this.disposeTerminal(id);
      }, 1000);
    });

    return terminal;
  }

  /**
   * Gets a terminal by ID
   */
  getTerminal(id: string): ITerminal | undefined {
    return this.terminals.get(id);
  }

  /**
   * Gets all terminals
   */
  getTerminals(): ITerminal[] {
    return Array.from(this.terminals.values());
  }

  /**
   * Disposes a terminal
   */
  disposeTerminal(id: string): void {
    const terminal = this.terminals.get(id);
    if (!terminal) {
      return;
    }

    this.terminals.delete(id);
    this.notifyDispose(terminal);
  }

  /**
   * Registers create listener
   */
  onDidCreateTerminal(listener: (terminal: ITerminal) => void): () => void {
    this.createListeners.push(listener);
    return () => {
      const index = this.createListeners.indexOf(listener);
      if (index >= 0) {
        this.createListeners.splice(index, 1);
      }
    };
  }

  /**
   * Registers dispose listener
   */
  onDidDisposeTerminal(listener: (terminal: ITerminal) => void): () => void {
    this.disposeListeners.push(listener);
    return () => {
      const index = this.disposeListeners.indexOf(listener);
      if (index >= 0) {
        this.disposeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Disposes all terminals
   */
  disposeAll(): void {
    const terminals = this.getTerminals();
    for (const terminal of terminals) {
      this.disposeTerminal(terminal.id);
    }
  }

  /**
   * Notifies create listeners
   */
  private notifyCreate(terminal: ITerminal): void {
    for (const listener of this.createListeners) {
      listener(terminal);
    }
  }

  /**
   * Notifies dispose listeners
   */
  private notifyDispose(terminal: ITerminal): void {
    for (const listener of this.disposeListeners) {
      listener(terminal);
    }
  }
}

/**
 * Global terminal manager instance
 */
export const terminalManager = new TerminalManager();
