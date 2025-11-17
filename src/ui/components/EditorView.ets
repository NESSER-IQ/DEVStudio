/**
 * EditorView Component
 * Main code editor view with syntax highlighting
 */

import { EditorModel } from '../../core/editor/EditorModel';
import { EditorController } from '../../core/editor/EditorController';
import { Selection } from '../../core/editor/types';

/**
 * Editor view component state
 */
@Observed
class EditorViewState {
  content: string = '';
  cursorPosition: { line: number; column: number } = { line: 0, column: 0 };
  selections: Selection[] = [];
  fontSize: number = 14;
  lineHeight: number = 20;
  scrollTop: number = 0;
}

/**
 * EditorView Component
 * Renders the code editor with syntax highlighting and cursor
 */
@Component
export struct EditorView {
  @State private state: EditorViewState = new EditorViewState();
  private model: EditorModel | null = null;
  private controller: EditorController | null = null;

  /**
   * Initialize the editor
   */
  aboutToAppear() {
    // Initialize editor model and controller
    this.model = new EditorModel('// Welcome to HarmonyOS Code Editor\n');
    this.controller = new EditorController(this.model);

    // Subscribe to model changes
    this.model.onDidChangeContent(() => {
      this.updateContent();
    });

    this.model.onDidChangeSelection((selections) => {
      this.state.selections = selections;
      if (selections.length > 0) {
        this.state.cursorPosition = {
          line: selections[0].active.line,
          column: selections[0].active.column
        };
      }
    });

    // Initial content update
    this.updateContent();
  }

  /**
   * Updates the content from model
   */
  private updateContent() {
    if (this.model) {
      this.state.content = this.model.getValue();
    }
  }

  /**
   * Handles text input
   */
  private handleTextInput(text: string) {
    if (this.controller) {
      this.controller.executeCommand('type', text);
    }
  }

  /**
   * Handles key events
   */
  private handleKeyEvent(event: KeyEvent): boolean {
    if (!this.controller) {
      return false;
    }

    // Map key events to commands
    switch (event.keyCode) {
      case KeyCode.KEYCODE_DPAD_UP:
        this.controller.executeCommand('cursorUp');
        return true;
      case KeyCode.KEYCODE_DPAD_DOWN:
        this.controller.executeCommand('cursorDown');
        return true;
      case KeyCode.KEYCODE_DPAD_LEFT:
        this.controller.executeCommand('cursorLeft');
        return true;
      case KeyCode.KEYCODE_DPAD_RIGHT:
        this.controller.executeCommand('cursorRight');
        return true;
      case KeyCode.KEYCODE_DEL:
        this.controller.executeCommand('deleteLeft');
        return true;
      case KeyCode.KEYCODE_FORWARD_DEL:
        this.controller.executeCommand('deleteRight');
        return true;
      case KeyCode.KEYCODE_ENTER:
        this.controller.executeCommand('newLine');
        return true;
      case KeyCode.KEYCODE_HOME:
        this.controller.executeCommand('cursorHome');
        return true;
      case KeyCode.KEYCODE_MOVE_END:
        this.controller.executeCommand('cursorEnd');
        return true;
      default:
        return false;
    }
  }

  build() {
    Column() {
      // Editor container
      Stack({ alignContent: Alignment.TopStart }) {
        // Line numbers
        Column() {
          ForEach(this.getVisibleLines(), (lineNum: number) => {
            Text(`${lineNum + 1}`)
              .fontSize(this.state.fontSize)
              .fontColor('#858585')
              .width(50)
              .height(this.state.lineHeight)
              .textAlign(TextAlign.End)
              .padding({ right: 10 })
          })
        }
        .width(60)
        .height('100%')
        .backgroundColor('#f5f5f5')

        // Editor content
        Scroll() {
          Column() {
            TextArea({ text: this.state.content })
              .fontSize(this.state.fontSize)
              .fontFamily('Consolas, Monaco, "Courier New", monospace')
              .width('100%')
              .height('auto')
              .backgroundColor('#ffffff')
              .onChange((value: string) => {
                // Handle text change
                if (this.model) {
                  this.model.setValue(value);
                }
              })
              .onKeyEvent((event: KeyEvent) => {
                this.handleKeyEvent(event);
              })
          }
        }
        .width('calc(100% - 60vp)')
        .height('100%')
        .margin({ left: 60 })
        .scrollBar(BarState.Auto)
        .edgeEffect(EdgeEffect.Spring)
      }
      .width('100%')
      .height('100%')

      // Status bar
      this.buildStatusBar();
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#ffffff')
  }

  /**
   * Builds the status bar
   */
  @Builder
  buildStatusBar() {
    Row() {
      // Cursor position
      Text(`Ln ${this.state.cursorPosition.line + 1}, Col ${this.state.cursorPosition.column + 1}`)
        .fontSize(12)
        .fontColor('#858585')
        .margin({ left: 10 })

      Blank()

      // File type
      Text('Plain Text')
        .fontSize(12)
        .fontColor('#858585')
        .margin({ right: 10 })
    }
    .width('100%')
    .height(24)
    .backgroundColor('#f0f0f0')
    .borderWidth({ top: 1 })
    .borderColor('#e0e0e0')
  }

  /**
   * Gets visible line numbers based on scroll position
   */
  private getVisibleLines(): number[] {
    if (!this.model) {
      return [];
    }

    const lineCount = this.model.getLineCount();
    const lines: number[] = [];

    for (let i = 0; i < lineCount; i++) {
      lines.push(i);
    }

    return lines;
  }

  /**
   * Gets the editor model
   */
  public getModel(): EditorModel | null {
    return this.model;
  }

  /**
   * Gets the editor controller
   */
  public getController(): EditorController | null {
    return this.controller;
  }
}
