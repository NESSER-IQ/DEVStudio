/**
 * EntryAbility - Application entry point
 * HarmonyOS application ability
 */

import UIAbility from '@ohos.app.ability.UIAbility';
import window from '@ohos.window';

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.info('[CodeEditor] Ability onCreate');
  }

  onDestroy() {
    console.info('[CodeEditor] Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.info('[CodeEditor] Ability onWindowStageCreate');

    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        console.error(`[CodeEditor] Failed to load content. Error: ${JSON.stringify(err)}`);
        return;
      }
      console.info(`[CodeEditor] Succeeded in loading content. Data: ${JSON.stringify(data)}`);
    });
  }

  onWindowStageDestroy() {
    console.info('[CodeEditor] Ability onWindowStageDestroy');
  }

  onForeground() {
    console.info('[CodeEditor] Ability onForeground');
  }

  onBackground() {
    console.info('[CodeEditor] Ability onBackground');
  }
}
