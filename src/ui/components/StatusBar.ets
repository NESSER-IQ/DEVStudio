/**
 * StatusBar Component
 * Displays editor status information
 */

/**
 * Status bar state
 */
@Observed
class StatusBarState {
  cursorPosition: { line: number; column: number } = { line: 1, column: 1 };
  language: string = 'Plain Text';
  encoding: string = 'UTF-8';
  lineEnding: string = 'LF';
  indentation: string = 'Spaces: 2';
  errors: number = 0;
  warnings: number = 0;
}

/**
 * StatusBar Component
 * Displays status information at the bottom of the editor
 */
@Component
export struct StatusBar {
  @State private state: StatusBarState = new StatusBarState();

  /**
   * Updates cursor position
   */
  public setCursorPosition(line: number, column: number) {
    this.state.cursorPosition = { line, column };
  }

  /**
   * Updates language
   */
  public setLanguage(language: string) {
    this.state.language = language;
  }

  /**
   * Updates encoding
   */
  public setEncoding(encoding: string) {
    this.state.encoding = encoding;
  }

  /**
   * Updates line ending
   */
  public setLineEnding(lineEnding: string) {
    this.state.lineEnding = lineEnding;
  }

  /**
   * Updates indentation
   */
  public setIndentation(indentation: string) {
    this.state.indentation = indentation;
  }

  /**
   * Updates error count
   */
  public setErrors(count: number) {
    this.state.errors = count;
  }

  /**
   * Updates warning count
   */
  public setWarnings(count: number) {
    this.state.warnings = count;
  }

  build() {
    Row() {
      // Left section
      Row() {
        // Branch info (Git)
        Row() {
          Text('⎇')
            .fontSize(14)
            .fontColor('#858585')
            .margin({ right: 4 })

          Text('main')
            .fontSize(12)
            .fontColor('#858585')
        }
        .margin({ left: 10, right: 15 })
        .onClick(() => {
          // TODO: Show branch selector
        })

        // Errors and warnings
        if (this.state.errors > 0 || this.state.warnings > 0) {
          Row() {
            if (this.state.errors > 0) {
              Text('✕')
                .fontSize(12)
                .fontColor('#f14c4c')
                .margin({ right: 4 })

              Text(`${this.state.errors}`)
                .fontSize(12)
                .fontColor('#858585')
                .margin({ right: 10 })
            }

            if (this.state.warnings > 0) {
              Text('⚠')
                .fontSize(12)
                .fontColor('#ff8c00')
                .margin({ right: 4 })

              Text(`${this.state.warnings}`)
                .fontSize(12)
                .fontColor('#858585')
            }
          }
          .margin({ right: 15 })
          .onClick(() => {
            // TODO: Show problems panel
          })
        }
      }

      Blank()

      // Right section
      Row() {
        // Cursor position
        Text(`Ln ${this.state.cursorPosition.line}, Col ${this.state.cursorPosition.column}`)
          .fontSize(12)
          .fontColor('#858585')
          .margin({ right: 15 })
          .onClick(() => {
            // TODO: Show go to line dialog
          })

        // Indentation
        Text(this.state.indentation)
          .fontSize(12)
          .fontColor('#858585')
          .margin({ right: 15 })
          .onClick(() => {
            // TODO: Show indentation selector
          })

        // Encoding
        Text(this.state.encoding)
          .fontSize(12)
          .fontColor('#858585')
          .margin({ right: 15 })
          .onClick(() => {
            // TODO: Show encoding selector
          })

        // Line ending
        Text(this.state.lineEnding)
          .fontSize(12)
          .fontColor('#858585')
          .margin({ right: 15 })
          .onClick(() => {
            // TODO: Show line ending selector
          })

        // Language
        Text(this.state.language)
          .fontSize(12)
          .fontColor('#858585')
          .margin({ right: 10 })
          .onClick(() => {
            // TODO: Show language selector
          })

        // Notifications
        Row() {
          Text('🔔')
            .fontSize(14)
        }
        .margin({ right: 10 })
        .onClick(() => {
          // TODO: Show notifications
        })
      }
    }
    .width('100%')
    .height(24)
    .backgroundColor('#0066cc')
    .padding({ left: 5, right: 5 })
  }
}
