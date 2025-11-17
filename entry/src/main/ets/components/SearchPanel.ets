/**
 * SearchPanel Component - Advanced Search and Replace
 * Global search across all files with regex support
 * v1.1 Feature
 */

import { FileSystemService } from '../services/FileSystemService';

export interface SearchResult {
  filePath: string;
  fileName: string;
  lineNumber: number;
  lineText: string;
  matchStart: number;
  matchEnd: number;
}

@Component
export struct SearchPanel {
  @State searchQuery: string = '';
  @State replaceQuery: string = '';
  @State results: SearchResult[] = [];
  @State isSearching: boolean = false;
  @State useRegex: boolean = false;
  @State caseSensitive: boolean = false;
  @State wholeWord: boolean = false;
  @State selectedResult: SearchResult | null = null;

  private fileSystemService: FileSystemService = new FileSystemService();

  build() {
    Column() {
      // Header
      Row() {
        Text('🔍')
          .fontSize(16)
          .margin({ right: 8 })

        Text('Search')
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
          .fontWeight(FontWeight.Bold)
          .textTransform(TextTransform.Uppercase)
          .layoutWeight(1)
      }
      .width('100%')
      .height(35)
      .padding({ left: 12, right: 8 })
      .backgroundColor($r('app.color.secondary_bg'))

      Divider()
        .color($r('app.color.border'))

      // Search input
      Column({ space: 8 }) {
        // Search field
        TextInput({ placeholder: 'Search...', text: this.searchQuery })
          .fontSize(13)
          .backgroundColor($r('app.color.secondary_bg'))
          .onChange((value: string) => {
            this.searchQuery = value;
          })
          .onSubmit(() => {
            this.performSearch();
          })

        // Replace field
        TextInput({ placeholder: 'Replace...', text: this.replaceQuery })
          .fontSize(13)
          .backgroundColor($r('app.color.secondary_bg'))
          .onChange((value: string) => {
            this.replaceQuery = value;
          })

        // Options
        Row({ space: 12 }) {
          Row({ space: 4 }) {
            Checkbox()
              .select(this.caseSensitive)
              .onChange((value: boolean) => {
                this.caseSensitive = value;
              })
              .width(16)
              .height(16)

            Text('Aa')
              .fontSize(11)
              .fontColor($r('app.color.text_secondary'))
              .onClick(() => {
                this.caseSensitive = !this.caseSensitive;
              })
          }

          Row({ space: 4 }) {
            Checkbox()
              .select(this.wholeWord)
              .onChange((value: boolean) => {
                this.wholeWord = value;
              })
              .width(16)
              .height(16)

            Text('|w|')
              .fontSize(11)
              .fontColor($r('app.color.text_secondary'))
              .fontFamily('monospace')
              .onClick(() => {
                this.wholeWord = !this.wholeWord;
              })
          }

          Row({ space: 4 }) {
            Checkbox()
              .select(this.useRegex)
              .onChange((value: boolean) => {
                this.useRegex = value;
              })
              .width(16)
              .height(16)

            Text('.*')
              .fontSize(11)
              .fontColor($r('app.color.text_secondary'))
              .fontFamily('monospace')
              .onClick(() => {
                this.useRegex = !this.useRegex;
              })
          }
        }
        .width('100%')

        // Action buttons
        Row({ space: 8 }) {
          Button('Search')
            .fontSize(12)
            .backgroundColor($r('app.color.accent'))
            .layoutWeight(1)
            .onClick(() => {
              this.performSearch();
            })

          Button('Replace')
            .fontSize(12)
            .backgroundColor($r('app.color.secondary_bg'))
            .fontColor($r('app.color.text_primary'))
            .layoutWeight(1)
            .onClick(() => {
              this.performReplace();
            })
        }
        .width('100%')
      }
      .padding(12)
      .width('100%')

      Divider()
        .color($r('app.color.border'))

      // Results
      if (this.isSearching) {
        Column() {
          LoadingProgress()
            .width(24)
            .height(24)
            .color($r('app.color.accent'))

          Text('Searching...')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .margin({ top: 8 })
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.results.length > 0) {
        Column() {
          // Results count
          Text(`${this.results.length} result${this.results.length > 1 ? 's' : ''}`)
            .fontSize(11)
            .fontColor($r('app.color.text_secondary'))
            .padding(12)

          // Results list
          List() {
            ForEach(this.results, (result: SearchResult) => {
              ListItem() {
                this.ResultItem(result)
              }
            })
          }
          .layoutWeight(1)
          .scrollBar(BarState.Auto)
        }
        .width('100%')
        .layoutWeight(1)
      } else if (this.searchQuery) {
        Column() {
          Text('No results found')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Column() {
          Text('Enter search query')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.secondary_bg'))
  }

  @Builder
  ResultItem(result: SearchResult) {
    Column() {
      // File name
      Text(result.fileName)
        .fontSize(12)
        .fontColor($r('app.color.text_primary'))
        .fontWeight(FontWeight.Medium)

      // Line info
      Row({ space: 4 }) {
        Text(`Line ${result.lineNumber}:`)
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))

        Text(result.lineText.trim())
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
          .fontFamily('monospace')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .margin({ top: 4 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(this.selectedResult === result ? '#37373D' : 'transparent')
    .onClick(() => {
      this.selectedResult = result;
      // Open file at line (would integrate with editor)
    })
  }

  async performSearch() {
    if (!this.searchQuery.trim()) return;

    this.isSearching = true;
    this.results = [];

    // In a real implementation, this would search all files in the workspace
    // For now, simulate search results
    await this.simulateSearch();

    this.isSearching = false;
  }

  async simulateSearch() {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate results
    this.results = [
      {
        filePath: '/entry/src/main/ets/pages/Index.ets',
        fileName: 'Index.ets',
        lineNumber: 42,
        lineText: '  @State currentFile: string = \'\';',
        matchStart: 10,
        matchEnd: 21
      },
      {
        filePath: '/entry/src/main/ets/components/FileExplorer.ets',
        fileName: 'FileExplorer.ets',
        lineNumber: 15,
        lineText: '  @State selectedFile: string = \'\';',
        matchStart: 10,
        matchEnd: 22
      }
    ];
  }

  async performReplace() {
    if (!this.searchQuery.trim() || !this.replaceQuery.trim()) return;

    // In a real implementation, this would replace occurrences
    console.info(`Replacing "${this.searchQuery}" with "${this.replaceQuery}"`);
  }
}
