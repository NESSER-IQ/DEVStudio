/**
 * BottomPanel Component - Terminal, Output, Problems
 * Displays terminal, build output, and diagnostics
 * v1.1: Enhanced terminal with ANSI colors and command history
 */

import { terminalService, TerminalLine } from '../services/TerminalService';

@Component
export struct BottomPanel {
  onClose?: () => void;

  @State selectedTab: string = 'terminal';
  @State terminalOutput: TerminalLine[] = [];
  @State currentCommand: string = '';
  @State suggestions: string[] = [];
  @State showSuggestions: boolean = false;

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

        // Clear button (for terminal)
        if (this.selectedTab === 'terminal' && this.terminalOutput.length > 0) {
          Button() {
            Text('🗑️')
              .fontSize(14)
          }
          .backgroundColor('transparent')
          .width(32)
          .height(32)
          .onClick(() => {
            this.terminalOutput = [];
            terminalService.clearOutput();
          })
        }

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
        Column() {
          // Welcome message
          if (this.terminalOutput.length === 0) {
            Text('Welcome to ArkStudio Terminal v1.1 ⚡\nType "help" for available commands\n')
              .fontSize(12)
              .fontColor($r('app.color.text_secondary'))
              .fontFamily('monospace')
              .padding(12)
          }

          // Output lines
          ForEach(this.terminalOutput, (line: TerminalLine, index: number) => {
            Row() {
              Text(this.formatTerminalLine(line))
                .fontSize(12)
                .fontColor(this.getLineColor(line.type))
                .fontFamily('monospace')
                .width('100%')
            }
            .width('100%')
            .padding({ left: 12, right: 12, top: 2, bottom: 2 })
          }, (line: TerminalLine, index: number) => `line_${index}_${line.timestamp}`)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
      }
      .layoutWeight(1)
      .scrollable(ScrollDirection.Vertical)
      .scrollBar(BarState.Auto)

      // Suggestions (if any)
      if (this.showSuggestions && this.suggestions.length > 0) {
        Column() {
          ForEach(this.suggestions.slice(0, 5), (suggestion: string) => {
            Text(suggestion)
              .fontSize(11)
              .fontColor($r('app.color.text_secondary'))
              .fontFamily('monospace')
              .padding({ left: 12, right: 12, top: 4, bottom: 4 })
              .width('100%')
              .backgroundColor('#2D2D30')
              .onClick(() => {
                this.currentCommand = suggestion;
                this.showSuggestions = false;
              })
          })
        }
        .width('100%')
        .backgroundColor('#1A1A1A')
        .border({ width: { top: 1 }, color: $r('app.color.border') })
        .maxHeight(120)
      }

      // Command input
      Row() {
        Text('$')
          .fontSize(12)
          .fontColor($r('app.color.success'))
          .margin({ right: 8 })

        TextInput({
          placeholder: 'Type a command... (↑/↓ for history)',
          text: this.currentCommand
        })
          .layoutWeight(1)
          .fontSize(12)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor('transparent')
          .placeholderColor($r('app.color.text_secondary'))
          .fontFamily('monospace')
          .onChange((value: string) => {
            this.currentCommand = value;
            // Show suggestions
            if (value.trim()) {
              this.suggestions = terminalService.getSuggestions(value.trim());
              this.showSuggestions = this.suggestions.length > 0;
            } else {
              this.showSuggestions = false;
            }
          })
          .onSubmit(() => {
            if (this.currentCommand.trim()) {
              this.executeCommand(this.currentCommand);
              this.currentCommand = '';
              this.showSuggestions = false;
            }
          })

        // Clear button
        if (this.currentCommand) {
          Button() {
            Text('×')
              .fontSize(16)
              .fontColor($r('app.color.text_secondary'))
          }
          .backgroundColor('transparent')
          .width(24)
          .height(24)
          .onClick(() => {
            this.currentCommand = '';
            this.showSuggestions = false;
          })
        }
      }
      .width('100%')
      .padding(8)
      .backgroundColor('#1A1A1A')
    }
    .width('100%')
    .height('100%')
  }

  formatTerminalLine(line: TerminalLine): string {
    const prefix = line.type === 'command' ? '$ ' :
                   line.type === 'error' ? '❌ ' :
                   line.type === 'info' ? 'ℹ️  ' : '';
    return `${prefix}${line.text}`;
  }

  getLineColor(type: TerminalLine['type']): ResourceStr {
    switch (type) {
      case 'command':
        return $r('app.color.text_primary');
      case 'error':
        return $r('app.color.error');
      case 'info':
        return $r('app.color.info');
      case 'output':
      default:
        return $r('app.color.text_secondary');
    }
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
    if (!command.trim()) return;

    // Add to terminal output
    terminalService.addOutput(command, 'command');

    // Add to history
    terminalService.addToHistory(command);

    // Handle built-in commands
    const cmd = command.trim().toLowerCase();

    if (cmd === 'clear') {
      this.terminalOutput = [];
      terminalService.clearOutput();
      return;
    }

    if (cmd === 'history') {
      const history = terminalService.getHistory();
      if (history.length === 0) {
        terminalService.addOutput('No command history', 'info');
      } else {
        terminalService.addOutput('Command History:', 'info');
        history.forEach((h, i) => {
          terminalService.addOutput(`  ${i + 1}  ${h}`, 'output');
        });
      }
      this.terminalOutput = terminalService.getOutput();
      return;
    }

    if (cmd === 'help') {
      const helpText = [
        'ArkStudio Terminal v1.1 - Available Commands:',
        '',
        'Built-in:',
        '  help      - Show this help message',
        '  clear     - Clear terminal screen',
        '  history   - Show command history',
        '',
        'File System:',
        '  ls        - List directory contents',
        '  cd <dir>  - Change directory',
        '  pwd       - Print working directory',
        '  mkdir     - Create directory',
        '  rm        - Remove file/directory',
        '',
        'Git:',
        '  git init           - Initialize repository',
        '  git clone <url>    - Clone repository',
        '  git add <files>    - Stage files',
        '  git commit -m "msg" - Commit changes',
        '  git push           - Push to remote',
        '  git pull           - Pull from remote',
        '  git status         - Show status',
        '  git log            - Show commit history',
        '',
        'HarmonyOS:',
        '  hvigorw assembleDebug   - Build debug version',
        '  hvigorw assembleRelease - Build release version',
        '',
        'Tips:',
        '  • Use ↑/↓ arrow keys to navigate command history',
        '  • Start typing for command suggestions',
        '  • Use Tab for auto-completion (coming soon)'
      ];

      helpText.forEach(line => {
        terminalService.addOutput(line, 'info');
      });
      this.terminalOutput = terminalService.getOutput();
      return;
    }

    // Simulate command execution
    terminalService.addOutput(`Executing: ${command}`, 'output');

    // Simulate different command results
    if (cmd.startsWith('git')) {
      terminalService.addOutput('✓ Git command simulated', 'info');
    } else if (cmd.startsWith('hvigorw')) {
      terminalService.addOutput('✓ Build command simulated', 'info');
    } else if (cmd === 'ls') {
      terminalService.addOutput('entry/  README.md  LICENSE  build-profile.json5', 'output');
    } else if (cmd === 'pwd') {
      terminalService.addOutput('/home/user/DEVStudio', 'output');
    } else {
      terminalService.addOutput('Command not found. Type "help" for available commands.', 'error');
    }

    // Update display
    this.terminalOutput = terminalService.getOutput();
  }
}
