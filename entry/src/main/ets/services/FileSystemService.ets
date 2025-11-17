/**
 * FileSystemService - Handles file system operations
 * Provides methods for reading, writing, and managing files
 */

import { fileIo as fs } from '@kit.CoreFileKit';
import { FileNode } from '../models/FileNode';

export class FileSystemService {
  /**
   * Get file tree structure for a directory
   */
  async getFileTree(directoryPath: string): Promise<FileNode[]> {
    try {
      const nodes: FileNode[] = [];

      // Check if directory exists
      if (!fs.accessSync(directoryPath)) {
        console.error('Directory does not exist:', directoryPath);
        return nodes;
      }

      // Read directory contents
      const files = fs.listFileSync(directoryPath);

      for (const fileName of files) {
        const filePath = `${directoryPath}/${fileName}`;

        try {
          const stat = fs.statSync(filePath);
          const isDirectory = stat.isDirectory();

          const node = new FileNode(
            fileName,
            filePath,
            isDirectory,
            stat.size,
            stat.mtime
          );

          // Recursively load subdirectories (limit depth for performance)
          if (isDirectory) {
            // We'll load children on demand (when folder is expanded)
            // to avoid loading entire tree at once
            node.children = [];
          }

          nodes.push(node);
        } catch (err) {
          console.error('Error reading file stats:', fileName, err);
        }
      }

      // Sort nodes (directories first, then alphabetically)
      nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return nodes;
    } catch (error) {
      console.error('Error reading directory:', directoryPath, error);
      return [];
    }
  }

  /**
   * Read file contents
   */
  async readFile(filePath: string): Promise<string> {
    try {
      const file = fs.openSync(filePath, fs.OpenMode.READ_ONLY);
      const buffer = new ArrayBuffer(4096);
      let content = '';

      while (true) {
        const readLen = fs.readSync(file.fd, buffer);
        if (readLen === 0) break;

        const uint8Array = new Uint8Array(buffer, 0, readLen);
        const decoder = new TextDecoder('utf-8');
        content += decoder.decode(uint8Array);
      }

      fs.closeSync(file);
      return content;
    } catch (error) {
      console.error('Error reading file:', filePath, error);
      return '';
    }
  }

  /**
   * Write content to file
   */
  async writeFile(filePath: string, content: string): Promise<boolean> {
    try {
      const file = fs.openSync(filePath, fs.OpenMode.CREATE | fs.OpenMode.WRITE_ONLY);
      const encoder = new TextEncoder();
      const buffer = encoder.encode(content);

      fs.writeSync(file.fd, buffer.buffer);
      fs.closeSync(file);

      return true;
    } catch (error) {
      console.error('Error writing file:', filePath, error);
      return false;
    }
  }

  /**
   * Create new file
   */
  async createFile(filePath: string): Promise<boolean> {
    try {
      const file = fs.openSync(filePath, fs.OpenMode.CREATE);
      fs.closeSync(file);
      return true;
    } catch (error) {
      console.error('Error creating file:', filePath, error);
      return false;
    }
  }

  /**
   * Create new directory
   */
  async createDirectory(directoryPath: string): Promise<boolean> {
    try {
      fs.mkdirSync(directoryPath);
      return true;
    } catch (error) {
      console.error('Error creating directory:', directoryPath, error);
      return false;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', filePath, error);
      return false;
    }
  }

  /**
   * Delete directory
   */
  async deleteDirectory(directoryPath: string): Promise<boolean> {
    try {
      fs.rmdirSync(directoryPath);
      return true;
    } catch (error) {
      console.error('Error deleting directory:', directoryPath, error);
      return false;
    }
  }

  /**
   * Rename file or directory
   */
  async rename(oldPath: string, newPath: string): Promise<boolean> {
    try {
      fs.renameSync(oldPath, newPath);
      return true;
    } catch (error) {
      console.error('Error renaming:', oldPath, error);
      return false;
    }
  }

  /**
   * Check if path exists
   */
  exists(path: string): boolean {
    try {
      return fs.accessSync(path);
    } catch {
      return false;
    }
  }

  /**
   * Get file stats
   */
  getStats(path: string): fs.Stat | null {
    try {
      return fs.statSync(path);
    } catch {
      return null;
    }
  }
}
