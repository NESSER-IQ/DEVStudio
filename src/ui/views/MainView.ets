/**
 * MainView - Main application layout
 * Combines all UI components into the main editor interface
 */

import { EditorView } from '../components/EditorView';
import { FileExplorer } from '../components/FileExplorer';
import { TabBar, TabItem } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';

/**
 * Main view state
 */
@Observed
class MainViewState {
  showSidebar: boolean = true;
  sidebarWidth: number = 250;
  workspacePath: string = '/workspace';
  currentTheme: string = 'light';
}

/**
 * MainView Component
 * The main application layout combining all components
 */
@Component
export struct MainView {
  @State private state: MainViewState = new MainViewState();
  @State private editorRef: EditorView | null = null;
  @State private tabBarRef: TabBar | null = null;
  @State private statusBarRef: StatusBar | null = null;

  /**
   * Initialize the main view
   */
  aboutToAppear() {
    console.log('MainView initialized');
  }

  /**
   * Handles file selection from file explorer
   */
  private onFileSelect(path: string) {
    console.log('File selected:', path);

    // Create a new tab for the file
    if (this.tabBarRef) {
      const fileName = this.getFileName(path);
      const tab: TabItem = {
        id: path,
        title: fileName,
        path: path,
        isDirty: false
      };

      this.tabBarRef.addTab(tab);
    }

    // TODO: Load file content into editor
  }

  /**
   * Handles tab selection
   */
  private onTabSelect(tabId: string) {
    console.log('Tab selected:', tabId);
    // TODO: Load tab content into editor
  }

  /**
   * Handles tab close
   */
  private onTabClose(tabId: string) {
    console.log('Tab closed:', tabId);
    if (this.tabBarRef) {
      this.tabBarRef.removeTab(tabId);
    }
  }

  /**
   * Toggles sidebar visibility
   */
  private toggleSidebar() {
    this.state.showSidebar = !this.state.showSidebar;
  }

  /**
   * Gets file name from path
   */
  private getFileName(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1] || 'Untitled';
  }

  build() {
    Column() {
      // Title bar
      this.buildTitleBar();

      // Main content area
      Row() {
        // Activity bar (left sidebar icons)
        this.buildActivityBar();

        // File explorer sidebar
        if (this.state.showSidebar) {
          FileExplorer({ workspacePath: this.state.workspacePath })
            .width(this.state.sidebarWidth)
            .height('100%')
        }

        // Editor area
        Column() {
          // Tab bar
          TabBar()
            .width('100%')

          // Editor
          EditorView()
            .width('100%')
            .height('calc(100% - 35vp)')
        }
        .layoutWeight(1)
        .height('100%')
      }
      .layoutWeight(1)
      .width('100%')

      // Status bar
      StatusBar()
        .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#ffffff')
  }

  /**
   * Builds the title bar
   */
  @Builder
  buildTitleBar() {
    Row() {
      // App icon and name
      Row() {
        Text('📝')
          .fontSize(18)
          .margin({ left: 10, right: 8 })

        Text('HarmonyOS Code Editor')
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')
      }

      Blank()

      // Window controls (minimize, maximize, close)
      Row() {
        Button({ type: ButtonType.Normal }) {
          Text('−')
            .fontSize(18)
        }
        .width(46)
        .height(32)
        .backgroundColor(Color.Transparent)

        Button({ type: ButtonType.Normal }) {
          Text('□')
            .fontSize(14)
        }
        .width(46)
        .height(32)
        .backgroundColor(Color.Transparent)

        Button({ type: ButtonType.Normal }) {
          Text('×')
            .fontSize(18)
        }
        .width(46)
        .height(32)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          // TODO: Close application
        })
      }
    }
    .width('100%')
    .height(35)
    .backgroundColor('#dddddd')
    .borderWidth({ bottom: 1 })
    .borderColor('#cccccc')
  }

  /**
   * Builds the activity bar
   */
  @Builder
  buildActivityBar() {
    Column() {
      // File explorer icon
      Button({ type: ButtonType.Normal }) {
        Text('📁')
          .fontSize(24)
      }
      .width(48)
      .height(48)
      .backgroundColor(this.state.showSidebar ? '#2c2c2c' : Color.Transparent)
      .margin({ top: 5 })
      .onClick(() => {
        this.toggleSidebar();
      })

      // Search icon
      Button({ type: ButtonType.Normal }) {
        Text('🔍')
          .fontSize(24)
      }
      .width(48)
      .height(48)
      .backgroundColor(Color.Transparent)
      .margin({ top: 5 })

      // Git icon
      Button({ type: ButtonType.Normal }) {
        Text('⎇')
          .fontSize(24)
      }
      .width(48)
      .height(48)
      .backgroundColor(Color.Transparent)
      .margin({ top: 5 })

      // Extensions icon
      Button({ type: ButtonType.Normal }) {
        Text('🧩')
          .fontSize(24)
      }
      .width(48)
      .height(48)
      .backgroundColor(Color.Transparent)
      .margin({ top: 5 })

      Blank()

      // Settings icon
      Button({ type: ButtonType.Normal }) {
        Text('⚙')
          .fontSize(24)
      }
      .width(48)
      .height(48)
      .backgroundColor(Color.Transparent)
      .margin({ bottom: 5 })
    }
    .width(48)
    .height('100%')
    .backgroundColor('#2c2c2c')
  }
}
