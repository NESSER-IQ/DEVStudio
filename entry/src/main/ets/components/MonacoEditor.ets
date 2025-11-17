/**
 * MonacoEditor Component - Code editor powered by Monaco
 * Integrates Monaco Editor (VS Code's core) via WebView
 */

import { webview } from '@kit.ArkWeb';

@Component
export struct MonacoEditor {
  @Prop content: string = '';
  @Prop filePath: string = '';
  @Prop language: string = 'typescript';
  @State isLoaded: boolean = false;

  private controller: webview.WebviewController = new webview.WebviewController();

  aboutToAppear() {
    // Initialize editor
  }

  build() {
    Stack() {
      // Monaco Editor WebView
      Web({
        src: $rawfile('monaco/index.html'),
        controller: this.controller
      })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(true)
        .onPageEnd(() => {
          this.isLoaded = true;
          this.initializeEditor();
        })
        .onConsole((event) => {
          console.info('Monaco Console:', event?.message.getMessage());
          return false;
        })
        .width('100%')
        .height('100%')

      // Loading indicator
      if (!this.isLoaded) {
        Column() {
          LoadingProgress()
            .color($r('app.color.accent'))
            .width(40)
            .height(40)

          Text('Loading Monaco Editor...')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .margin({ top: 12 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor($r('app.color.editor_bg'))
      }
    }
    .width('100%')
    .height('100%')
  }

  initializeEditor() {
    // Set editor content
    this.setEditorContent(this.content);
    this.setEditorLanguage(this.language);
    this.setEditorTheme('vs-dark');
  }

  setEditorContent(content: string) {
    const escapedContent = content.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    this.controller.runJavaScript(`setEditorContent('${escapedContent}')`);
  }

  setEditorLanguage(language: string) {
    this.controller.runJavaScript(`setEditorLanguage('${language}')`);
  }

  setEditorTheme(theme: string) {
    this.controller.runJavaScript(`setEditorTheme('${theme}')`);
  }

  getEditorContent(callback: (content: string) => void) {
    this.controller.runJavaScript('getEditorContent()')
      .then((result) => {
        callback(result as string);
      })
      .catch((error: Error) => {
        console.error('Failed to get editor content:', error);
      });
  }

  // LSP Integration methods
  registerLanguageServer(languageId: string, serverUrl: string) {
    this.controller.runJavaScript(`registerLanguageServer('${languageId}', '${serverUrl}')`);
  }

  // Editor actions
  formatDocument() {
    this.controller.runJavaScript('formatDocument()');
  }

  findText(text: string) {
    this.controller.runJavaScript(`findText('${text}')`);
  }

  replaceText(find: string, replace: string) {
    this.controller.runJavaScript(`replaceText('${find}', '${replace}')`);
  }
}
