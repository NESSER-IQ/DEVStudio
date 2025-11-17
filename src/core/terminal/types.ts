/**
 * Terminal types and interfaces
 */

/**
 * Terminal options
 */
export interface TerminalOptions {
  name?: string;
  shellPath?: string;
  shellArgs?: string[];
  cwd?: string;
  env?: Record<string, string>;
  encoding?: string;
}

/**
 * Terminal output
 */
export interface TerminalOutput {
  type: 'stdout' | 'stderr';
  data: string;
  timestamp: number;
}

/**
 * Terminal state
 */
export enum TerminalState {
  Idle = 'idle',
  Running = 'running',
  Exited = 'exited'
}

/**
 * Terminal interface
 */
export interface ITerminal {
  /**
   * Terminal ID
   */
  readonly id: string;

  /**
   * Terminal name
   */
  readonly name: string;

  /**
   * Current state
   */
  readonly state: TerminalState;

  /**
   * Executes a command
   */
  execute(command: string): Promise<number>;

  /**
   * Writes data to terminal
   */
  write(data: string): void;

  /**
   * Clears terminal output
   */
  clear(): void;

  /**
   * Kills the terminal process
   */
  kill(): void;

  /**
   * Gets terminal history
   */
  getHistory(): TerminalOutput[];

  /**
   * Event: on output
   */
  onOutput(listener: (output: TerminalOutput) => void): () => void;

  /**
   * Event: on exit
   */
  onExit(listener: (exitCode: number) => void): () => void;
}

/**
 * Terminal manager interface
 */
export interface ITerminalManager {
  /**
   * Creates a new terminal
   */
  createTerminal(options?: TerminalOptions): ITerminal;

  /**
   * Gets a terminal by ID
   */
  getTerminal(id: string): ITerminal | undefined;

  /**
   * Gets all terminals
   */
  getTerminals(): ITerminal[];

  /**
   * Disposes a terminal
   */
  disposeTerminal(id: string): void;

  /**
   * Event: on terminal created
   */
  onDidCreateTerminal(listener: (terminal: ITerminal) => void): () => void;

  /**
   * Event: on terminal disposed
   */
  onDidDisposeTerminal(listener: (terminal: ITerminal) => void): () => void;
}
