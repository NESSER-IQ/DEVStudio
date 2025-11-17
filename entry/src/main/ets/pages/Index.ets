/**
 * Index Page - Main entry page
 * Renders the main application view
 */

import { MainView } from '../../../../src/ui/views/MainView';

@Entry
@Component
struct Index {
  @State message: string = 'HarmonyOS Code Editor';

  aboutToAppear() {
    console.info('[CodeEditor] Index page aboutToAppear');
  }

  build() {
    Column() {
      MainView()
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
