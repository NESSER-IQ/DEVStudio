/**
 * FileExplorer Component
 * Displays the file tree and allows navigation
 */

import { FileEntry, FileType } from '../../core/filesystem/types';

/**
 * File explorer state
 */
@Observed
class FileExplorerState {
  files: FileEntry[] = [];
  expandedFolders: Set<string> = new Set();
  selectedFile: string | null = null;
  currentPath: string = '/';
}

/**
 * FileExplorer Component
 * Displays a hierarchical file tree
 */
@Component
export struct FileExplorer {
  @State private state: FileExplorerState = new FileExplorerState();
  @Link workspacePath: string;
  private onFileSelect?: (path: string) => void;

  /**
   * Initialize component
   */
  aboutToAppear() {
    this.loadFiles(this.workspacePath);
  }

  /**
   * Loads files from a directory
   */
  private async loadFiles(path: string) {
    try {
      // TODO: Load files using FileSystemProvider
      // const files = await fileSystem.readDirectory(path);
      // this.state.files = files;

      // Mock data for demonstration
      this.state.files = [
        { name: 'src', path: '/workspace/src', type: FileType.Directory },
        { name: 'package.json', path: '/workspace/package.json', type: FileType.File, size: 1024 },
        { name: 'tsconfig.json', path: '/workspace/tsconfig.json', type: FileType.File, size: 512 },
        { name: 'README.md', path: '/workspace/README.md', type: FileType.File, size: 2048 }
      ];
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  }

  /**
   * Toggles folder expansion
   */
  private toggleFolder(path: string) {
    if (this.state.expandedFolders.has(path)) {
      this.state.expandedFolders.delete(path);
    } else {
      this.state.expandedFolders.add(path);
      this.loadFiles(path);
    }
  }

  /**
   * Handles file selection
   */
  private selectFile(file: FileEntry) {
    if (file.type === FileType.Directory) {
      this.toggleFolder(file.path);
    } else {
      this.state.selectedFile = file.path;
      if (this.onFileSelect) {
        this.onFileSelect(file.path);
      }
    }
  }

  /**
   * Gets icon for file type
   */
  private getFileIcon(file: FileEntry): string {
    if (file.type === FileType.Directory) {
      return this.state.expandedFolders.has(file.path) ? '📂' : '📁';
    }

    // File type icons based on extension
    const ext = this.getFileExtension(file.name);
    switch (ext) {
      case '.js':
      case '.jsx':
        return '📄';
      case '.ts':
      case '.tsx':
      case '.ets':
        return '📘';
      case '.json':
        return '📋';
      case '.md':
        return '📝';
      case '.css':
        return '🎨';
      case '.html':
        return '🌐';
      default:
        return '📄';
    }
  }

  /**
   * Gets file extension
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot >= 0 ? fileName.substring(lastDot) : '';
  }

  /**
   * Formats file size
   */
  private formatSize(size?: number): string {
    if (!size) return '';

    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  build() {
    Column() {
      // Header
      Row() {
        Text('EXPLORER')
          .fontSize(11)
          .fontWeight(FontWeight.Bold)
          .fontColor('#858585')
          .margin({ left: 20 })

        Blank()

        // Actions
        Row() {
          Button({ type: ButtonType.Normal }) {
            Text('⊕')
              .fontSize(16)
          }
          .width(24)
          .height(24)
          .backgroundColor(Color.Transparent)
          .margin({ right: 5 })

          Button({ type: ButtonType.Normal }) {
            Text('⋯')
              .fontSize(16)
          }
          .width(24)
          .height(24)
          .backgroundColor(Color.Transparent)
          .margin({ right: 10 })
        }
      }
      .width('100%')
      .height(35)
      .backgroundColor('#f5f5f5')

      // File list
      Scroll() {
        Column() {
          ForEach(this.state.files, (file: FileEntry) => {
            this.buildFileItem(file);
          })
        }
        .width('100%')
      }
      .width('100%')
      .height('calc(100% - 35vp)')
      .scrollBar(BarState.Auto)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f8f8')
  }

  /**
   * Builds a file item
   */
  @Builder
  buildFileItem(file: FileEntry) {
    Row() {
      // Icon
      Text(this.getFileIcon(file))
        .fontSize(16)
        .margin({ left: 10, right: 5 })

      // Name
      Text(file.name)
        .fontSize(13)
        .fontColor(this.state.selectedFile === file.path ? '#ffffff' : '#333333')
        .flexGrow(1)

      // Size (for files)
      if (file.type === FileType.File && file.size) {
        Text(this.formatSize(file.size))
          .fontSize(11)
          .fontColor('#858585')
          .margin({ right: 10 })
      }
    }
    .width('100%')
    .height(28)
    .backgroundColor(this.state.selectedFile === file.path ? '#0066cc' : Color.Transparent)
    .onClick(() => {
      this.selectFile(file);
    })
    .hoverEffect(HoverEffect.Highlight)
  }

  /**
   * Sets file selection callback
   */
  public setOnFileSelect(callback: (path: string) => void) {
    this.onFileSelect = callback;
  }
}
