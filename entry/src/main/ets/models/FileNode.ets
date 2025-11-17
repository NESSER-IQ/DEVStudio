/**
 * FileNode Model - Represents a file or directory in the file tree
 */

export class FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: number;
  children?: FileNode[];
  extension?: string;

  constructor(
    name: string,
    path: string,
    isDirectory: boolean,
    size?: number,
    lastModified?: number
  ) {
    this.name = name;
    this.path = path;
    this.isDirectory = isDirectory;
    this.size = size;
    this.lastModified = lastModified;
    this.children = isDirectory ? [] : undefined;

    if (!isDirectory) {
      const parts = name.split('.');
      this.extension = parts.length > 1 ? parts[parts.length - 1] : '';
    }
  }

  addChild(child: FileNode): void {
    if (this.isDirectory && this.children) {
      this.children.push(child);
    }
  }

  sortChildren(): void {
    if (this.children) {
      this.children.sort((a, b) => {
        // Directories first
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        // Then alphabetically
        return a.name.localeCompare(b.name);
      });
    }
  }

  getFileType(): string {
    if (this.isDirectory) return 'directory';
    return this.extension || 'unknown';
  }

  getDisplaySize(): string {
    if (!this.size) return '';

    const kb = this.size / 1024;
    if (kb < 1) return `${this.size} B`;

    const mb = kb / 1024;
    if (mb < 1) return `${kb.toFixed(2)} KB`;

    return `${mb.toFixed(2)} MB`;
  }
}
