/**
 * BottomPanel Component - Terminal, Output, Problems
 * Displays terminal, build output, and diagnostics
 */

@Component
export struct BottomPanel {
  onClose?: () => void;

  @State selectedTab: string = 'terminal';
  @State terminalOutput: string = '$ Welcome to ArkStudio Terminal\n';

  private tabs = [
    { id: 'terminal', label: 'Terminal', icon: '💻' },
    { id: 'output', label: 'Output', icon: '📋' },
    { id: 'problems', label: 'Problems', icon: '⚠️' },
    { id: 'debug', label: 'Debug Console', icon: '🐛' }
  ];

  build() {
    Column() {
      // Tabs
      Row() {
        ForEach(this.tabs, (tab: { id: string, label: string, icon: string }) => {
          Row({ space: 4 }) {
            Text(tab.icon)
              .fontSize(12)

            Text(tab.label)
              .fontSize(12)
              .fontColor(this.selectedTab === tab.id ?
                $r('app.color.text_primary') : $r('app.color.text_secondary'))
          }
          .height('100%')
          .padding({ left: 12, right: 12 })
          .backgroundColor(this.selectedTab === tab.id ? $r('app.color.editor_bg') : 'transparent')
          .onClick(() => {
            this.selectedTab = tab.id;
          })
        })

        Blank()

        // Close button
        Button() {
          Text('×')
            .fontSize(18)
            .fontColor($r('app.color.text_secondary'))
        }
        .backgroundColor('transparent')
        .width(32)
        .height(32)
        .onClick(() => {
          if (this.onClose) {
            this.onClose();
          }
        })
      }
      .height(35)
      .width('100%')
      .backgroundColor($r('app.color.secondary_bg'))
      .border({ width: { top: 1 }, color: $r('app.color.border') })

      // Content
      Column() {
        if (this.selectedTab === 'terminal') {
          this.TerminalContent()
        } else if (this.selectedTab === 'output') {
          this.OutputContent()
        } else if (this.selectedTab === 'problems') {
          this.ProblemsContent()
        } else if (this.selectedTab === 'debug') {
          this.DebugContent()
        }
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.editor_bg'))
  }

  @Builder
  TerminalContent() {
    Column() {
      // Terminal output area
      Scroll() {
        Text(this.terminalOutput)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .fontFamily('monospace')
          .width('100%')
          .padding(12)
      }
      .layoutWeight(1)
      .scrollable(ScrollDirection.Vertical)
      .scrollBar(BarState.Auto)

      // Command input
      Row() {
        Text('$')
          .fontSize(12)
          .fontColor($r('app.color.success'))
          .margin({ right: 8 })

        TextInput({ placeholder: 'Type a command...' })
          .layoutWeight(1)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor('transparent')
          .placeholderColor($r('app.color.text_secondary'))
          .onSubmit((value: string) => {
            this.executeCommand(value);
          })
      }
      .width('100%')
      .padding(8)
      .backgroundColor('#1A1A1A')
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  OutputContent() {
    Column() {
      Text('Build output will appear here')
        .fontSize(12)
        .fontColor($r('app.color.text_secondary'))
        .padding(12)
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  ProblemsContent() {
    Column() {
      Text('No problems detected')
        .fontSize(12)
        .fontColor($r('app.color.text_secondary'))
        .padding(12)
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  DebugContent() {
    Column() {
      Text('Debug console')
        .fontSize(12)
        .fontColor($r('app.color.text_secondary'))
        .padding(12)
    }
    .width('100%')
    .height('100%')
  }

  executeCommand(command: string) {
    this.terminalOutput += `$ ${command}\n`;
    // Here we would actually execute the command
    // For now, just echo it back
    this.terminalOutput += `Command executed: ${command}\n`;
  }
}
