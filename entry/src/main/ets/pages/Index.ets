import { FileExplorer } from '../components/FileExplorer';
import { MonacoEditor } from '../components/MonacoEditor';
import { Sidebar } from '../components/Sidebar';
import { BottomPanel } from '../components/BottomPanel';
import { Topbar } from '../components/Topbar';

@Entry
@Component
struct Index {
  @State showFileExplorer: boolean = true;
  @State showBottomPanel: boolean = false;
  @State currentFile: string = '';
  @State fileContent: string = '// Welcome to ArkStudio\n// Your HarmonyOS Native IDE\n\n';
  @State selectedSidebarItem: string = 'files';

  // Adaptive layout breakpoints
  @State isCompact: boolean = false; // Phone
  @State isMedium: boolean = false;  // Small tablet
  @State isLarge: boolean = true;    // Large tablet/2in1

  aboutToAppear() {
    // Initialize the IDE
    this.checkDeviceType();
  }

  checkDeviceType() {
    // This would be replaced with actual device detection
    // For now, default to large layout
    this.isLarge = true;
  }

  toggleFileExplorer() {
    this.showFileExplorer = !this.showFileExplorer;
  }

  toggleBottomPanel() {
    this.showBottomPanel = !this.showBottomPanel;
  }

  onFileSelected(filePath: string, content: string) {
    this.currentFile = filePath;
    this.fileContent = content;
  }

  onSidebarItemSelected(item: string) {
    this.selectedSidebarItem = item;
    if (item === 'files') {
      this.showFileExplorer = true;
    }
  }

  build() {
    Column() {
      // Top bar with file tabs and actions
      Topbar({
        currentFile: this.currentFile,
        onToggleFileExplorer: () => this.toggleFileExplorer(),
        onToggleBottomPanel: () => this.toggleBottomPanel()
      })

      // Main content area
      Row() {
        // Sidebar with icons
        Sidebar({
          selectedItem: this.selectedSidebarItem,
          onItemSelected: (item: string) => this.onSidebarItemSelected(item)
        })

        // File Explorer (collapsible)
        if (this.showFileExplorer && this.selectedSidebarItem === 'files') {
          FileExplorer({
            onFileSelected: (path: string, content: string) => this.onFileSelected(path, content)
          })
            .width(this.isCompact ? '60%' : 250)
        }

        // Editor area
        Column() {
          // Monaco Editor
          MonacoEditor({
            content: this.fileContent,
            filePath: this.currentFile,
            language: this.detectLanguage(this.currentFile)
          })
            .layoutWeight(1)

          // Bottom panel (terminal, output, problems)
          if (this.showBottomPanel) {
            BottomPanel({
              onClose: () => this.toggleBottomPanel()
            })
              .height(this.isCompact ? '40%' : 200)
          }
        }
        .layoutWeight(1)
        .backgroundColor($r('app.color.editor_bg'))
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.primary_bg'))
  }

  detectLanguage(filePath: string): string {
    if (!filePath) return 'plaintext';

    const ext = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'ets': 'typescript',
      'js': 'javascript',
      'json': 'json',
      'json5': 'json',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'rs': 'rust',
      'go': 'go',
      'sh': 'shell'
    };

    return languageMap[ext || ''] || 'plaintext';
  }
}
