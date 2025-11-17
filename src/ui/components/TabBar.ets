/**
 * TabBar Component
 * Displays open file tabs
 */

/**
 * Tab item
 */
export interface TabItem {
  id: string;
  title: string;
  path: string;
  isDirty: boolean;
  icon?: string;
}

/**
 * TabBar state
 */
@Observed
class TabBarState {
  tabs: TabItem[] = [];
  activeTabId: string | null = null;
}

/**
 * TabBar Component
 * Displays tabs for open files
 */
@Component
export struct TabBar {
  @State private state: TabBarState = new TabBarState();
  private onTabSelect?: (tabId: string) => void;
  private onTabClose?: (tabId: string) => void;

  /**
   * Adds a new tab
   */
  public addTab(tab: TabItem) {
    // Check if tab already exists
    const existingIndex = this.state.tabs.findIndex(t => t.id === tab.id);

    if (existingIndex >= 0) {
      // Tab exists, just activate it
      this.setActiveTab(tab.id);
    } else {
      // Add new tab
      this.state.tabs.push(tab);
      this.setActiveTab(tab.id);
    }
  }

  /**
   * Removes a tab
   */
  public removeTab(tabId: string) {
    const index = this.state.tabs.findIndex(t => t.id === tabId);

    if (index >= 0) {
      this.state.tabs.splice(index, 1);

      // If removed tab was active, activate another tab
      if (this.state.activeTabId === tabId) {
        if (this.state.tabs.length > 0) {
          const newIndex = Math.min(index, this.state.tabs.length - 1);
          this.setActiveTab(this.state.tabs[newIndex].id);
        } else {
          this.state.activeTabId = null;
        }
      }
    }
  }

  /**
   * Sets the active tab
   */
  public setActiveTab(tabId: string) {
    this.state.activeTabId = tabId;
    if (this.onTabSelect) {
      this.onTabSelect(tabId);
    }
  }

  /**
   * Updates tab dirty state
   */
  public setTabDirty(tabId: string, isDirty: boolean) {
    const tab = this.state.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.isDirty = isDirty;
    }
  }

  /**
   * Gets file icon based on extension
   */
  private getFileIcon(path: string): string {
    const ext = this.getFileExtension(path);

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

  build() {
    Row() {
      // Tabs
      Scroll(this.scroller) {
        Row() {
          ForEach(this.state.tabs, (tab: TabItem) => {
            this.buildTab(tab);
          })
        }
        .height('100%')
      }
      .width('100%')
      .height('100%')
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height(35)
    .backgroundColor('#f5f5f5')
    .borderWidth({ bottom: 1 })
    .borderColor('#e0e0e0')
  }

  private scroller: Scroller = new Scroller();

  /**
   * Builds a single tab
   */
  @Builder
  buildTab(tab: TabItem) {
    Row() {
      // Icon
      Text(tab.icon || this.getFileIcon(tab.path))
        .fontSize(14)
        .margin({ left: 8, right: 4 })

      // Title
      Text(tab.title)
        .fontSize(13)
        .fontColor(this.state.activeTabId === tab.id ? '#333333' : '#666666')
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      // Dirty indicator
      if (tab.isDirty) {
        Text('●')
          .fontSize(10)
          .fontColor('#0066cc')
          .margin({ left: 4 })
      }

      // Close button
      Button({ type: ButtonType.Normal }) {
        Text('×')
          .fontSize(18)
          .fontColor('#666666')
      }
      .width(20)
      .height(20)
      .backgroundColor(Color.Transparent)
      .margin({ left: 4, right: 4 })
      .onClick(() => {
        if (this.onTabClose) {
          this.onTabClose(tab.id);
        }
      })
    }
    .height('100%')
    .padding({ left: 4, right: 4 })
    .backgroundColor(this.state.activeTabId === tab.id ? '#ffffff' : Color.Transparent)
    .borderWidth(this.state.activeTabId === tab.id ? { top: 2 } : {})
    .borderColor(this.state.activeTabId === tab.id ? '#0066cc' : Color.Transparent)
    .onClick(() => {
      this.setActiveTab(tab.id);
    })
    .hoverEffect(HoverEffect.Highlight)
  }

  /**
   * Sets tab selection callback
   */
  public setOnTabSelect(callback: (tabId: string) => void) {
    this.onTabSelect = callback;
  }

  /**
   * Sets tab close callback
   */
  public setOnTabClose(callback: (tabId: string) => void) {
    this.onTabClose = callback;
  }

  /**
   * Gets active tab
   */
  public getActiveTab(): TabItem | null {
    if (!this.state.activeTabId) {
      return null;
    }
    return this.state.tabs.find(t => t.id === this.state.activeTabId) || null;
  }

  /**
   * Gets all tabs
   */
  public getTabs(): TabItem[] {
    return [...this.state.tabs];
  }
}
