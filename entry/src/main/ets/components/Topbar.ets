/**
 * Topbar Component - Application header
 * Shows current file, tabs, and action buttons
 */

@Component
export struct Topbar {
  @Prop currentFile: string;
  onToggleFileExplorer?: () => void;
  onToggleBottomPanel?: () => void;

  build() {
    Row() {
      // App logo and name
      Row() {
        Text('⚡')
          .fontSize(20)
          .margin({ right: 8 })

        Text('ArkStudio')
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
      }
      .padding({ left: 12, right: 12 })

      Divider()
        .vertical(true)
        .height(20)
        .color($r('app.color.border'))

      // Current file tab
      Row() {
        if (this.currentFile) {
          Row() {
            Text(this.getFileName(this.currentFile))
              .fontSize(13)
              .fontColor($r('app.color.text_primary'))
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })

            Text('×')
              .fontSize(16)
              .fontColor($r('app.color.text_secondary'))
              .margin({ left: 8 })
              .onClick(() => {
                // Close file action
              })
          }
          .padding({ left: 12, right: 8 })
          .height('100%')
          .backgroundColor($r('app.color.editor_bg'))
        } else {
          Text('No file open')
            .fontSize(13)
            .fontColor($r('app.color.text_secondary'))
            .padding({ left: 12 })
        }
      }
      .layoutWeight(1)

      // Action buttons
      Row({ space: 4 }) {
        // Toggle file explorer
        Button() {
          Text('📂')
            .fontSize(16)
        }
        .backgroundColor('transparent')
        .width(32)
        .height(32)
        .onClick(() => {
          if (this.onToggleFileExplorer) {
            this.onToggleFileExplorer();
          }
        })

        // Toggle terminal
        Button() {
          Text('💻')
            .fontSize(16)
        }
        .backgroundColor('transparent')
        .width(32)
        .height(32)
        .onClick(() => {
          if (this.onToggleBottomPanel) {
            this.onToggleBottomPanel();
          }
        })

        // More actions
        Button() {
          Text('⋯')
            .fontSize(16)
        }
        .backgroundColor('transparent')
        .width(32)
        .height(32)
      }
      .padding({ right: 8 })
    }
    .width('100%')
    .height(40)
    .backgroundColor($r('app.color.secondary_bg'))
    .border({ width: { bottom: 1 }, color: $r('app.color.border') })
  }

  getFileName(path: string): string {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  }
}
