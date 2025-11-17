/**
 * Git service types and interfaces
 */

/**
 * Git status
 */
export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
  staged: string[];
}

/**
 * Git commit
 */
export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  parents: string[];
}

/**
 * Git branch
 */
export interface GitBranch {
  name: string;
  current: boolean;
  remote: boolean;
  upstream?: string;
}

/**
 * Git remote
 */
export interface GitRemote {
  name: string;
  url: string;
  fetch: string;
  push: string;
}

/**
 * Git diff
 */
export interface GitDiff {
  file: string;
  oldContent: string;
  newContent: string;
  hunks: GitDiffHunk[];
}

/**
 * Git diff hunk
 */
export interface GitDiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: GitDiffLine[];
}

/**
 * Git diff line
 */
export interface GitDiffLine {
  type: 'added' | 'deleted' | 'context';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

/**
 * Git file status
 */
export enum GitFileStatus {
  Unmodified = ' ',
  Modified = 'M',
  Added = 'A',
  Deleted = 'D',
  Renamed = 'R',
  Copied = 'C',
  Untracked = '?',
  Ignored = '!'
}

/**
 * Git repository interface
 */
export interface IGitRepository {
  /**
   * Repository root path
   */
  readonly rootPath: string;

  /**
   * Gets current status
   */
  getStatus(): Promise<GitStatus>;

  /**
   * Gets commit history
   */
  getHistory(limit?: number): Promise<GitCommit[]>;

  /**
   * Gets branches
   */
  getBranches(): Promise<GitBranch[]>;

  /**
   * Gets remotes
   */
  getRemotes(): Promise<GitRemote[]>;

  /**
   * Stages files
   */
  stage(files: string[]): Promise<void>;

  /**
   * Unstages files
   */
  unstage(files: string[]): Promise<void>;

  /**
   * Commits staged changes
   */
  commit(message: string): Promise<string>;

  /**
   * Pushes to remote
   */
  push(remote?: string, branch?: string): Promise<void>;

  /**
   * Pulls from remote
   */
  pull(remote?: string, branch?: string): Promise<void>;

  /**
   * Creates a branch
   */
  createBranch(name: string): Promise<void>;

  /**
   * Checks out a branch
   */
  checkout(branch: string): Promise<void>;

  /**
   * Gets diff
   */
  getDiff(file?: string): Promise<GitDiff[]>;

  /**
   * Discards changes
   */
  discard(files: string[]): Promise<void>;
}
