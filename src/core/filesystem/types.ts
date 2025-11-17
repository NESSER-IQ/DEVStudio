/**
 * Filesystem types and interfaces
 */

/**
 * File type enumeration
 */
export enum FileType {
  File = 1,
  Directory = 2,
  SymbolicLink = 64
}

/**
 * File information
 */
export interface FileStat {
  type: FileType;
  size: number;
  mtime: number;
  ctime: number;
  permissions?: number;
}

/**
 * File entry (for directory listing)
 */
export interface FileEntry {
  name: string;
  path: string;
  type: FileType;
  size?: number;
  mtime?: number;
}

/**
 * File change event type
 */
export enum FileChangeType {
  Created = 1,
  Changed = 2,
  Deleted = 3
}

/**
 * File change event
 */
export interface FileChangeEvent {
  type: FileChangeType;
  path: string;
}

/**
 * File watcher
 */
export interface IFileWatcher {
  dispose(): void;
}

/**
 * Filesystem provider interface
 */
export interface IFileSystemProvider {
  // Read operations
  readFile(path: string): Promise<string>;
  readDirectory(path: string): Promise<FileEntry[]>;
  stat(path: string): Promise<FileStat>;
  exists(path: string): Promise<boolean>;

  // Write operations
  writeFile(path: string, content: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  delete(path: string, recursive?: boolean): Promise<void>;
  rename(oldPath: string, newPath: string): Promise<void>;

  // Watch operations
  watch(path: string, recursive: boolean, onChange: (events: FileChangeEvent[]) => void): IFileWatcher;
}

/**
 * Workspace folder
 */
export interface WorkspaceFolder {
  name: string;
  path: string;
  index: number;
}

/**
 * Workspace configuration
 */
export interface WorkspaceConfiguration {
  folders: WorkspaceFolder[];
  settings: Record<string, any>;
}
