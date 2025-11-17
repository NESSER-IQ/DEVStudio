/**
 * EditorPage - Dedicated editor page
 * Can be used for fullscreen editing or split view
 */

import { MonacoEditor } from '../components/MonacoEditor';

@Entry
@Component
struct EditorPage {
  @State filePath: string = '';
  @State fileContent: string = '';
  @State language: string = 'typescript';

  aboutToAppear() {
    // Get file info from router params if available
  }

  build() {
    Column() {
      // Header
      Row() {
        Button() {
          Text('←')
            .fontSize(20)
            .fontColor($r('app.color.text_primary'))
        }
        .backgroundColor('transparent')
        .onClick(() => {
          // Navigate back
        })

        Text(this.getFileName())
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
          .margin({ left: 12 })

        Button('Save')
          .fontSize(12)
          .backgroundColor($r('app.color.accent'))
          .onClick(() => {
            // Save file
          })
      }
      .width('100%')
      .height(50)
      .padding({ left: 12, right: 12 })
      .backgroundColor($r('app.color.secondary_bg'))

      // Editor
      MonacoEditor({
        content: this.fileContent,
        filePath: this.filePath,
        language: this.language
      })
        .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.editor_bg'))
  }

  getFileName(): string {
    if (!this.filePath) return 'Untitled';
    const parts = this.filePath.split('/');
    return parts[parts.length - 1] || 'Untitled';
  }
}
