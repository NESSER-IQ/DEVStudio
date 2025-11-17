/**
 * SettingsPage - Application settings and preferences
 */

import { themeService } from '../services/ThemeService';
import { Theme } from '../models/Theme';

@Entry
@Component
struct SettingsPage {
  @State fontSize: number = 14;
  @State currentTheme: Theme = themeService.getCurrentTheme();
  @State enableLSP: boolean = true;
  @State enableGit: boolean = true;
  @State autoSave: boolean = true;
  @State tabSize: number = 2;
  @State showThemePicker: boolean = false;

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

        Text('Settings')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .margin({ left: 12 })
      }
      .width('100%')
      .height(50)
      .padding({ left: 12, right: 12 })
      .backgroundColor($r('app.color.secondary_bg'))

      // Settings list
      Scroll() {
        Column() {
          // Editor Settings
          this.SettingsSection('Editor')

          this.SettingItem(
            'Font Size',
            `${this.fontSize}px`,
            () => {
              // Open font size picker
            }
          )

          this.SettingItem(
            'Tab Size',
            `${this.tabSize} spaces`,
            () => {
              // Open tab size picker
            }
          )

          this.SettingToggle(
            'Auto Save',
            'Automatically save files after editing',
            this.autoSave,
            (value: boolean) => {
              this.autoSave = value;
            }
          )

          Divider()
            .color($r('app.color.border'))
            .margin({ top: 12, bottom: 12 })

          // Theme Settings
          this.SettingsSection('Appearance')

          this.SettingItem(
            'Theme',
            this.currentTheme.displayName,
            () => {
              this.showThemePicker = true;
            }
          )

          Divider()
            .color($r('app.color.border'))
            .margin({ top: 12, bottom: 12 })

          // Features
          this.SettingsSection('Features')

          this.SettingToggle(
            'Language Server Protocol',
            'Enable LSP for code intelligence',
            this.enableLSP,
            (value: boolean) => {
              this.enableLSP = value;
            }
          )

          this.SettingToggle(
            'Git Integration',
            'Enable Git version control',
            this.enableGit,
            (value: boolean) => {
              this.enableGit = value;
            }
          )

          Divider()
            .color($r('app.color.border'))
            .margin({ top: 12, bottom: 12 })

          // About
          this.SettingsSection('About')

          this.SettingItem(
            'Version',
            '1.1.0',
            null
          )

          this.SettingItem(
            'ArkStudio',
            'HarmonyOS Native IDE',
            null
          )

          Text('Built with ArkTS & ArkUI')
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
            .margin({ top: 12 })
            .textAlign(TextAlign.Center)
            .width('100%')
        }
        .padding(16)
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.primary_bg'))

    // Theme Picker Dialog
    if (this.showThemePicker) {
      this.ThemePickerDialog()
    }
  }

  @Builder
  ThemePickerDialog() {
    Column() {
      // Backdrop
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor('#80000000')
        .onClick(() => {
          this.showThemePicker = false;
        })

      // Dialog
      Column() {
        // Header
        Row() {
          Text('Select Theme')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor($r('app.color.text_primary'))
            .layoutWeight(1)

          Button() {
            Text('×')
              .fontSize(24)
              .fontColor($r('app.color.text_secondary'))
          }
          .backgroundColor('transparent')
          .width(40)
          .height(40)
          .onClick(() => {
            this.showThemePicker = false;
          })
        }
        .width('100%')
        .padding(16)

        Divider()
          .color($r('app.color.border'))

        // Theme options
        Column() {
          ForEach(themeService.getAllThemes(), (theme: Theme) => {
            Row() {
              Column() {
                Text(theme.displayName)
                  .fontSize(16)
                  .fontColor($r('app.color.text_primary'))

                Text(theme.type)
                  .fontSize(12)
                  .fontColor($r('app.color.text_secondary'))
                  .margin({ top: 4 })
                  .textTransform(TextTransform.Capitalize)
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)

              if (this.currentTheme.id === theme.id) {
                Text('✓')
                  .fontSize(24)
                  .fontColor($r('app.color.accent'))
              }
            }
            .width('100%')
            .padding(16)
            .backgroundColor(this.currentTheme.id === theme.id ?
              $r('app.color.tertiaryBg') : 'transparent')
            .borderRadius(8)
            .onClick(async () => {
              await themeService.setTheme(theme.id);
              this.currentTheme = themeService.getCurrentTheme();
              this.showThemePicker = false;
            })
          })
        }
        .padding(16)
      }
      .width('90%')
      .maxWidth(400)
      .backgroundColor($r('app.color.secondary_bg'))
      .borderRadius(12)
      .position({ x: '5%', y: '30%' })
    }
    .width('100%')
    .height('100%')
    .position({ x: 0, y: 0 })
  }

  @Builder
  SettingsSection(title: string) {
    Text(title)
      .fontSize(12)
      .fontColor($r('app.color.text_secondary'))
      .fontWeight(FontWeight.Bold)
      .textTransform(TextTransform.Uppercase)
      .margin({ top: 8, bottom: 8 })
  }

  @Builder
  SettingItem(label: string, value: string, onClick: (() => void) | null) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor($r('app.color.text_primary'))
        .layoutWeight(1)

      Text(value)
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))

      if (onClick) {
        Text('›')
          .fontSize(18)
          .fontColor($r('app.color.text_secondary'))
          .margin({ left: 8 })
      }
    }
    .width('100%')
    .height(50)
    .padding({ left: 12, right: 12 })
    .backgroundColor($r('app.color.secondary_bg'))
    .borderRadius(8)
    .margin({ top: 4, bottom: 4 })
    .onClick(() => {
      if (onClick) {
        onClick();
      }
    })
  }

  @Builder
  SettingToggle(
    label: string,
    description: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) {
    Row() {
      Column() {
        Text(label)
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))

        Text(description)
          .fontSize(12)
          .fontColor($r('app.color.text_secondary'))
          .margin({ top: 4 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Toggle({ type: ToggleType.Switch, isOn: value })
        .onChange((isOn: boolean) => {
          onChange(isOn);
        })
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('app.color.secondary_bg'))
    .borderRadius(8)
    .margin({ top: 4, bottom: 4 })
  }
}
