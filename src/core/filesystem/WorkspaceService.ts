/**
 * WorkspaceService - Manages workspace folders and configuration
 */

import { WorkspaceFolder, WorkspaceConfiguration } from './types';
import { FileSystemProvider } from './FileSystemProvider';

/**
 * WorkspaceService manages workspace folders and settings
 */
export class WorkspaceService {
  private folders: WorkspaceFolder[] = [];
  private settings: Record<string, any> = {};
  private fileSystem: FileSystemProvider;

  // Event listeners
  private folderChangeListeners: Array<(folders: WorkspaceFolder[]) => void> = [];

  /**
   * Creates a new WorkspaceService
   */
  constructor(fileSystem: FileSystemProvider) {
    this.fileSystem = fileSystem;
  }

  // ===== Folder Management =====

  /**
   * Gets all workspace folders
   */
  getWorkspaceFolders(): WorkspaceFolder[] {
    return [...this.folders];
  }

  /**
   * Adds a folder to the workspace
   * @param path - Folder path
   * @param name - Folder name (optional, defaults to folder name)
   */
  async addFolder(path: string, name?: string): Promise<void> {
    // Check if folder exists
    const exists = await this.fileSystem.exists(path);
    if (!exists) {
      throw new Error(`Folder does not exist: ${path}`);
    }

    // Check if already added
    if (this.folders.some(f => f.path === path)) {
      throw new Error(`Folder already in workspace: ${path}`);
    }

    // Add folder
    const folder: WorkspaceFolder = {
      name: name || this.getBaseName(path),
      path,
      index: this.folders.length
    };

    this.folders.push(folder);
    this.notifyFolderChange();
  }

  /**
   * Removes a folder from the workspace
   * @param path - Folder path
   */
  removeFolder(path: string): void {
    const index = this.folders.findIndex(f => f.path === path);
    if (index === -1) {
      throw new Error(`Folder not in workspace: ${path}`);
    }

    this.folders.splice(index, 1);

    // Update indices
    this.folders.forEach((folder, i) => {
      folder.index = i;
    });

    this.notifyFolderChange();
  }

  /**
   * Gets a folder by path
   * @param path - Folder path
   */
  getFolder(path: string): WorkspaceFolder | undefined {
    return this.folders.find(f => f.path === path);
  }

  /**
   * Checks if a path is within the workspace
   * @param path - Path to check
   */
  isInWorkspace(path: string): boolean {
    return this.folders.some(folder => path.startsWith(folder.path));
  }

  // ===== Settings Management =====

  /**
   * Gets all workspace settings
   */
  getSettings(): Record<string, any> {
    return { ...this.settings };
  }

  /**
   * Gets a specific setting
   * @param key - Setting key (supports dot notation)
   */
  getSetting<T = any>(key: string, defaultValue?: T): T | undefined {
    const keys = key.split('.');
    let value: any = this.settings;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value as T;
  }

  /**
   * Sets a setting
   * @param key - Setting key (supports dot notation)
   * @param value - Setting value
   */
  setSetting(key: string, value: any): void {
    const keys = key.split('.');
    let obj: any = this.settings;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in obj) || typeof obj[k] !== 'object') {
        obj[k] = {};
      }
      obj = obj[k];
    }

    obj[keys[keys.length - 1]] = value;
  }

  /**
   * Deletes a setting
   * @param key - Setting key
   */
  deleteSetting(key: string): void {
    const keys = key.split('.');
    let obj: any = this.settings;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in obj) || typeof obj[k] !== 'object') {
        return; // Setting doesn't exist
      }
      obj = obj[k];
    }

    delete obj[keys[keys.length - 1]];
  }

  // ===== Configuration =====

  /**
   * Gets the workspace configuration
   */
  getConfiguration(): WorkspaceConfiguration {
    return {
      folders: this.getWorkspaceFolders(),
      settings: this.getSettings()
    };
  }

  /**
   * Loads workspace configuration from a file
   * @param path - Configuration file path
   */
  async loadConfiguration(path: string): Promise<void> {
    try {
      const content = await this.fileSystem.readFile(path);
      const config: WorkspaceConfiguration = JSON.parse(content);

      // Clear current workspace
      this.folders = [];
      this.settings = {};

      // Load folders
      for (const folder of config.folders) {
        await this.addFolder(folder.path, folder.name);
      }

      // Load settings
      this.settings = config.settings || {};
    } catch (error) {
      throw new Error(`Failed to load workspace configuration: ${error}`);
    }
  }

  /**
   * Saves workspace configuration to a file
   * @param path - Configuration file path
   */
  async saveConfiguration(path: string): Promise<void> {
    try {
      const config = this.getConfiguration();
      const content = JSON.stringify(config, null, 2);
      await this.fileSystem.writeFile(path, content);
    } catch (error) {
      throw new Error(`Failed to save workspace configuration: ${error}`);
    }
  }

  // ===== Events =====

  /**
   * Registers a folder change listener
   */
  onDidChangeFolders(listener: (folders: WorkspaceFolder[]) => void): () => void {
    this.folderChangeListeners.push(listener);
    return () => {
      const index = this.folderChangeListeners.indexOf(listener);
      if (index >= 0) {
        this.folderChangeListeners.splice(index, 1);
      }
    };
  }

  // ===== Helper Methods =====

  /**
   * Gets the base name from a path
   */
  private getBaseName(path: string): string {
    const normalized = path.replace(/\\/g, '/');
    const lastSlash = normalized.lastIndexOf('/');
    return lastSlash === -1 ? normalized : normalized.substring(lastSlash + 1);
  }

  /**
   * Notifies folder change listeners
   */
  private notifyFolderChange(): void {
    const folders = this.getWorkspaceFolders();
    for (const listener of this.folderChangeListeners) {
      listener(folders);
    }
  }
}
