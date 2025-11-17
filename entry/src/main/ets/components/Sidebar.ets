/**
 * Sidebar Component - Icon-based navigation
 * Provides quick access to main IDE features
 */

export interface SidebarMenuItem {
  id: string;
  icon: string;
  label: string;
}

@Component
export struct Sidebar {
  @Link selectedItem: string;
  onItemSelected?: (item: string) => void;

  private menuItems: SidebarMenuItem[] = [
    { id: 'files', icon: '📁', label: 'Files' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'git', icon: '🌿', label: 'Git' },
    { id: 'extensions', icon: '🧩', label: 'Extensions' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  build() {
    Column() {
      ForEach(this.menuItems, (item: SidebarMenuItem) => {
        Column() {
          Text(item.icon)
            .fontSize(24)
            .fontColor(this.selectedItem === item.id ? $r('app.color.accent') : $r('app.color.text_secondary'))

          Text(item.label)
            .fontSize(10)
            .fontColor(this.selectedItem === item.id ? $r('app.color.accent') : $r('app.color.text_secondary'))
            .margin({ top: 4 })
        }
        .width('100%')
        .height(60)
        .justifyContent(FlexAlign.Center)
        .backgroundColor(this.selectedItem === item.id ? '#2D2D30' : 'transparent')
        .onClick(() => {
          this.selectedItem = item.id;
          if (this.onItemSelected) {
            this.onItemSelected(item.id);
          }
        })
        .animation({
          duration: 200,
          curve: Curve.EaseInOut
        })
      })

      Blank()
    }
    .width(48)
    .height('100%')
    .backgroundColor($r('app.color.sidebar_bg'))
  }
}
