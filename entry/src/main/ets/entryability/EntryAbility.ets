import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';

export default class EntryAbility extends UIAbility {
  private windowStage: window.WindowStage | null = null;

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onCreate');
  }

  onDestroy(): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onWindowStageCreate');

    this.windowStage = windowStage;

    // Set window to fullscreen
    windowStage.getMainWindow((err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'ArkStudio', 'Failed to obtain the main window. Error: %{public}s', JSON.stringify(err));
        return;
      }

      let windowClass: window.Window = data;
      // Set window to immersive mode for better IDE experience
      windowClass.setWindowLayoutFullScreen(true, (err) => {
        if (err.code) {
          hilog.error(0x0000, 'ArkStudio', 'Failed to set full screen. Error: %{public}s', JSON.stringify(err));
          return;
        }
        hilog.info(0x0000, 'ArkStudio', 'Succeeded in setting full screen.');
      });
    });

    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        hilog.error(0x0000, 'ArkStudio', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'ArkStudio', 'Succeeded in loading the content.');
    });
  }

  onWindowStageDestroy(): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    hilog.info(0x0000, 'ArkStudio', '%{public}s', 'Ability onBackground');
  }
}
