/**
 * FileExplorer Component - File system browser
 * Displays files and folders in a tree structure
 */

import { FileNode } from '../models/FileNode';
import { FileSystemService } from '../services/FileSystemService';

@Component
export struct FileExplorer {
  onFileSelected?: (path: string, content: string) => void;

  @State rootPath: string = '';
  @State fileTree: FileNode[] = [];
  @State expandedFolders: Set<string> = new Set();
  @State selectedFile: string = '';

  private fileSystemService: FileSystemService = new FileSystemService();

  aboutToAppear() {
    this.loadDefaultWorkspace();
  }

  async loadDefaultWorkspace() {
    // Load a default workspace or show "Open Folder" prompt
    this.fileTree = await this.fileSystemService.getFileTree('/data/storage/el2/base/haps/entry/files');
    this.rootPath = '/data/storage/el2/base/haps/entry/files';
  }

  async openFolder(path: string) {
    this.fileTree = await this.fileSystemService.getFileTree(path);
    this.rootPath = path;
  }

  toggleFolder(path: string) {
    if (this.expandedFolders.has(path)) {
      this.expandedFolders.delete(path);
    } else {
      this.expandedFolders.add(path);
    }
    // Trigger re-render
    this.expandedFolders = new Set(this.expandedFolders);
  }

  async selectFile(node: FileNode) {
    if (node.isDirectory) {
      this.toggleFolder(node.path);
    } else {
      this.selectedFile = node.path;
      const content = await this.fileSystemService.readFile(node.path);
      if (this.onFileSelected) {
        this.onFileSelected(node.path, content);
      }
    }
  }

  @Builder
  fileTreeItem(node: FileNode, depth: number = 0) {
    Column() {
      // File/Folder row
      Row() {
        // Indentation
        Blank()
          .width(depth * 16)

        // Expand/collapse icon for folders
        if (node.isDirectory) {
          Text(this.expandedFolders.has(node.path) ? '▼' : '▶')
            .fontSize(10)
            .fontColor($r('app.color.text_secondary'))
            .width(16)
        } else {
          Blank()
            .width(16)
        }

        // Icon
        Text(this.getFileIcon(node))
          .fontSize(16)
          .margin({ right: 6 })

        // Name
        Text(node.name)
          .fontSize(13)
          .fontColor(this.selectedFile === node.path ?
            $r('app.color.text_primary') : $r('app.color.text_secondary'))
          .layoutWeight(1)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .width('100%')
      .height(28)
      .padding({ left: 8, right: 8 })
      .backgroundColor(this.selectedFile === node.path ? '#37373D' : 'transparent')
      .onClick(() => this.selectFile(node))

      // Children (if folder is expanded)
      if (node.isDirectory && this.expandedFolders.has(node.path) && node.children) {
        ForEach(node.children, (child: FileNode) => {
          this.fileTreeItem(child, depth + 1)
        })
      }
    }
  }

  build() {
    Column() {
      // Header
      Row() {
        Text($r('app.string.file_explorer'))
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
          .fontWeight(FontWeight.Bold)
          .textTransform(TextTransform.Uppercase)
          .layoutWeight(1)

        // Actions
        Row({ space: 4 }) {
          Button() {
            Text('📄')
              .fontSize(14)
          }
          .backgroundColor('transparent')
          .width(24)
          .height(24)
          .onClick(() => {
            // New file
          })

          Button() {
            Text('📁')
              .fontSize(14)
          }
          .backgroundColor('transparent')
          .width(24)
          .height(24)
          .onClick(() => {
            // New folder
          })

          Button() {
            Text('🔄')
              .fontSize(14)
          }
          .backgroundColor('transparent')
          .width(24)
          .height(24)
          .onClick(() => {
            this.loadDefaultWorkspace();
          })
        }
      }
      .width('100%')
      .height(35)
      .padding({ left: 12, right: 8 })
      .backgroundColor($r('app.color.secondary_bg'))

      Divider()
        .color($r('app.color.border'))

      // File tree
      if (this.fileTree.length > 0) {
        List() {
          ForEach(this.fileTree, (node: FileNode) => {
            ListItem() {
              this.fileTreeItem(node, 0)
            }
          })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
      } else {
        Column() {
          Text('No folder opened')
            .fontSize(13)
            .fontColor($r('app.color.text_secondary'))
            .margin({ bottom: 12 })

          Button($r('app.string.open_folder'))
            .fontSize(12)
            .backgroundColor($r('app.color.accent'))
            .onClick(() => {
              // Open folder picker
            })
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.secondary_bg'))
    .border({ width: { right: 1 }, color: $r('app.color.border') })
  }

  getFileIcon(node: FileNode): string {
    if (node.isDirectory) {
      return this.expandedFolders.has(node.path) ? '📂' : '📁';
    }

    const ext = node.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'ts': '📘',
      'ets': '⚡',
      'js': '📜',
      'json': '📋',
      'json5': '📋',
      'html': '🌐',
      'css': '🎨',
      'md': '📝',
      'png': '🖼️',
      'jpg': '🖼️',
      'svg': '🎨',
      'git': '🌿'
    };

    return iconMap[ext || ''] || '📄';
  }
}
