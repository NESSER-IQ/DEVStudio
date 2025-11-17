/**
 * Terminal Component
 * Integrated terminal emulator
 */

import { ITerminal, TerminalOutput } from '../../core/terminal/types';
import { terminalManager } from '../../core/terminal/TerminalManager';

/**
 * Terminal state
 */
@Observed
class TerminalState {
  output: string = '';
  command: string = '';
  isRunning: boolean = false;
}

/**
 * Terminal Component
 * Displays terminal output and handles input
 */
@Component
export struct TerminalComponent {
  @State private state: TerminalState = new TerminalState();
  private terminal: ITerminal | null = null;
  private scrollController: Scroller = new Scroller();

  /**
   * Initialize terminal
   */
  aboutToAppear() {
    // Create terminal instance
    this.terminal = terminalManager.createTerminal({
      name: 'Terminal 1',
      cwd: '/workspace'
    });

    // Listen to output
    this.terminal.onOutput((output: TerminalOutput) => {
      this.handleOutput(output);
    });

    // Get initial history
    const history = this.terminal.getHistory();
    for (const item of history) {
      this.handleOutput(item);
    }
  }

  /**
   * Cleanup
   */
  aboutToDisappear() {
    if (this.terminal) {
      terminalManager.disposeTerminal(this.terminal.id);
    }
  }

  /**
   * Handles terminal output
   */
  private handleOutput(output: TerminalOutput) {
    const color = output.type === 'stderr' ? '\x1b[31m' : '';
    const reset = output.type === 'stderr' ? '\x1b[0m' : '';
    this.state.output += color + output.data + reset;

    // Auto-scroll to bottom
    setTimeout(() => {
      this.scrollController.scrollEdge(Edge.Bottom);
    }, 50);
  }

  /**
   * Executes command
   */
  private async executeCommand() {
    if (!this.terminal || !this.state.command.trim()) {
      return;
    }

    const command = this.state.command;
    this.state.command = '';
    this.state.isRunning = true;

    try {
      await this.terminal.execute(command);
    } catch (error) {
      console.error('Command execution error:', error);
    } finally {
      this.state.isRunning = false;
    }
  }

  /**
   * Clears terminal
   */
  private clearTerminal() {
    if (this.terminal) {
      this.terminal.clear();
      this.state.output = '';
    }
  }

  build() {
    Column() {
      // Terminal header
      Row() {
        Text('TERMINAL')
          .fontSize(11)
          .fontWeight(FontWeight.Bold)
          .fontColor('#858585')
          .margin({ left: 10 })

        Blank()

        // Actions
        Row() {
          // Clear button
          Button({ type: ButtonType.Normal }) {
            Text('🗑')
              .fontSize(14)
          }
          .width(24)
          .height(24)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            this.clearTerminal();
          })
          .margin({ right: 5 })

          // Close button
          Button({ type: ButtonType.Normal }) {
            Text('×')
              .fontSize(18)
          }
          .width(24)
          .height(24)
          .backgroundColor(Color.Transparent)
          .margin({ right: 5 })
        }
      }
      .width('100%')
      .height(30)
      .backgroundColor('#f5f5f5')
      .borderWidth({ bottom: 1 })
      .borderColor('#e0e0e0')

      // Terminal output
      Scroll(this.scrollController) {
        Column() {
          Text(this.state.output)
            .fontSize(13)
            .fontFamily('Consolas, Monaco, "Courier New", monospace')
            .fontColor('#00ff00')
            .width('100%')
            .padding(10)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')
      .height('calc(100% - 30vp - 40vp)')
      .backgroundColor('#000000')
      .scrollBar(BarState.Auto)

      // Command input
      Row() {
        Text('$')
          .fontSize(13)
          .fontFamily('Consolas, Monaco, "Courier New", monospace')
          .fontColor('#00ff00')
          .margin({ left: 10, right: 5 })

        TextInput({ text: this.state.command })
          .fontSize(13)
          .fontFamily('Consolas, Monaco, "Courier New", monospace')
          .fontColor('#00ff00')
          .backgroundColor('#000000')
          .border({ width: 0 })
          .layoutWeight(1)
          .enabled(!this.state.isRunning)
          .onChange((value: string) => {
            this.state.command = value;
          })
          .onSubmit(() => {
            this.executeCommand();
          })

        if (this.state.isRunning) {
          LoadingProgress()
            .width(20)
            .height(20)
            .color('#00ff00')
            .margin({ right: 10 })
        }
      }
      .width('100%')
      .height(40)
      .backgroundColor('#000000')
      .borderWidth({ top: 1 })
      .borderColor('#333333')
    }
    .width('100%')
    .height('100%')
  }

  /**
   * Gets the terminal instance
   */
  public getTerminal(): ITerminal | null {
    return this.terminal;
  }
}
