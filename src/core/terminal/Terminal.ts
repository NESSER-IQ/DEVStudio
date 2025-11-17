/**
 * Terminal - Terminal emulator implementation
 */

import {
  ITerminal,
  TerminalOptions,
  TerminalOutput,
  TerminalState
} from './types';

/**
 * Terminal implementation
 */
export class Terminal implements ITerminal {
  readonly id: string;
  readonly name: string;

  private _state: TerminalState = TerminalState.Idle;
  private history: TerminalOutput[] = [];
  private outputListeners: Array<(output: TerminalOutput) => void> = [];
  private exitListeners: Array<(exitCode: number) => void> = [];
  private commandHistory: string[] = [];
  private currentCommand: string = '';
  private process: any = null; // TODO: Replace with actual process handle

  private options: TerminalOptions;

  constructor(id: string, options: TerminalOptions = {}) {
    this.id = id;
    this.name = options.name || `Terminal ${id}`;
    this.options = options;

    // Add welcome message
    this.addOutput('stdout', this.getWelcomeMessage());
  }

  /**
   * Gets current state
   */
  get state(): TerminalState {
    return this._state;
  }

  /**
   * Executes a command
   */
  async execute(command: string): Promise<number> {
    if (this._state === TerminalState.Exited) {
      throw new Error('Terminal has exited');
    }

    // Add command to history
    this.commandHistory.push(command);
    this.currentCommand = command;

    // Echo command
    this.addOutput('stdout', `$ ${command}\n`);

    this._state = TerminalState.Running;

    try {
      // TODO: Execute actual command using HarmonyOS process API
      // For now, simulate execution
      const exitCode = await this.simulateExecution(command);

      this._state = TerminalState.Idle;
      return exitCode;
    } catch (error) {
      this.addOutput('stderr', `Error: ${error}\n`);
      this._state = TerminalState.Idle;
      return 1;
    }
  }

  /**
   * Writes data to terminal
   */
  write(data: string): void {
    // TODO: Write to actual terminal process
    // For now, just add to output
    this.addOutput('stdout', data);
  }

  /**
   * Clears terminal output
   */
  clear(): void {
    this.history = [];
    this.addOutput('stdout', this.getWelcomeMessage());
  }

  /**
   * Kills the terminal process
   */
  kill(): void {
    if (this.process) {
      // TODO: Kill actual process
      this.process = null;
    }

    this._state = TerminalState.Exited;
    this.notifyExit(0);
  }

  /**
   * Gets terminal history
   */
  getHistory(): TerminalOutput[] {
    return [...this.history];
  }

  /**
   * Registers output listener
   */
  onOutput(listener: (output: TerminalOutput) => void): () => void {
    this.outputListeners.push(listener);
    return () => {
      const index = this.outputListeners.indexOf(listener);
      if (index >= 0) {
        this.outputListeners.splice(index, 1);
      }
    };
  }

  /**
   * Registers exit listener
   */
  onExit(listener: (exitCode: number) => void): () => void {
    this.exitListeners.push(listener);
    return () => {
      const index = this.exitListeners.indexOf(listener);
      if (index >= 0) {
        this.exitListeners.splice(index, 1);
      }
    };
  }

  /**
   * Gets command history
   */
  getCommandHistory(): string[] {
    return [...this.commandHistory];
  }

  /**
   * Adds output to history
   */
  private addOutput(type: 'stdout' | 'stderr', data: string): void {
    const output: TerminalOutput = {
      type,
      data,
      timestamp: Date.now()
    };

    this.history.push(output);
    this.notifyOutput(output);
  }

  /**
   * Notifies output listeners
   */
  private notifyOutput(output: TerminalOutput): void {
    for (const listener of this.outputListeners) {
      listener(output);
    }
  }

  /**
   * Notifies exit listeners
   */
  private notifyExit(exitCode: number): void {
    for (const listener of this.exitListeners) {
      listener(exitCode);
    }
  }

  /**
   * Gets welcome message
   */
  private getWelcomeMessage(): string {
    return `HarmonyOS Code Editor Terminal v1.0.0\n` +
           `Type 'help' for available commands\n\n`;
  }

  /**
   * Simulates command execution (placeholder)
   */
  private async simulateExecution(command: string): Promise<number> {
    // Parse command
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    // Simulate delay
    await this.delay(100);

    // Handle built-in commands
    switch (cmd) {
      case 'help':
        this.addOutput('stdout', this.getHelpMessage());
        return 0;

      case 'clear':
        this.clear();
        return 0;

      case 'echo':
        this.addOutput('stdout', args.join(' ') + '\n');
        return 0;

      case 'pwd':
        this.addOutput('stdout', (this.options.cwd || '/workspace') + '\n');
        return 0;

      case 'ls':
        this.addOutput('stdout', 'src/\npackage.json\ntsconfig.json\nREADME.md\n');
        return 0;

      case 'exit':
        this.kill();
        return 0;

      default:
        this.addOutput('stderr', `Command not found: ${cmd}\n`);
        return 127;
    }
  }

  /**
   * Gets help message
   */
  private getHelpMessage(): string {
    return `Available commands:\n` +
           `  help     - Show this help message\n` +
           `  clear    - Clear terminal output\n` +
           `  echo     - Echo text\n` +
           `  pwd      - Print working directory\n` +
           `  ls       - List directory contents\n` +
           `  exit     - Exit terminal\n\n`;
  }

  /**
   * Delays execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
