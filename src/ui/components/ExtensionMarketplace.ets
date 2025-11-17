/**
 * ExtensionMarketplace Component
 * Browse and install extensions
 */

import { MarketplaceExtension, SearchOptions } from '../../extensions/marketplace/MarketplaceService';
import { marketplaceService } from '../../extensions/marketplace/MarketplaceService';
import { extensionRegistry } from '../../extensions/marketplace/ExtensionRegistry';

/**
 * Marketplace state
 */
@Observed
class MarketplaceState {
  extensions: MarketplaceExtension[] = [];
  searchQuery: string = '';
  selectedExtension: MarketplaceExtension | null = null;
  isLoading: boolean = false;
  currentView: 'browse' | 'installed' | 'details' = 'browse';
}

/**
 * ExtensionMarketplace Component
 */
@Component
export struct ExtensionMarketplace {
  @State private state: MarketplaceState = new MarketplaceState();

  /**
   * Initialize
   */
  async aboutToAppear() {
    await this.loadExtensions();
  }

  /**
   * Loads extensions
   */
  private async loadExtensions() {
    this.state.isLoading = true;

    try {
      const options: SearchOptions = {
        query: this.state.searchQuery || undefined,
        sortBy: 'installs'
      };

      const result = await marketplaceService.search(options);
      this.state.extensions = result.extensions;
    } catch (error) {
      console.error('Failed to load extensions:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Searches extensions
   */
  private async searchExtensions() {
    await this.loadExtensions();
  }

  /**
   * Shows extension details
   */
  private showExtensionDetails(extension: MarketplaceExtension) {
    this.state.selectedExtension = extension;
    this.state.currentView = 'details';
  }

  /**
   * Installs an extension
   */
  private async installExtension(extension: MarketplaceExtension) {
    try {
      this.state.isLoading = true;

      // Download extension
      const path = await marketplaceService.download(extension.id);

      // Install extension
      await extensionRegistry.install(path);

      // TODO: Show success message
      console.log(`Extension ${extension.id} installed successfully`);
    } catch (error) {
      console.error('Failed to install extension:', error);
      // TODO: Show error message
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Uninstalls an extension
   */
  private async uninstallExtension(extensionId: string) {
    try {
      this.state.isLoading = true;
      await extensionRegistry.uninstall(extensionId);

      // TODO: Show success message
      console.log(`Extension ${extensionId} uninstalled successfully`);
    } catch (error) {
      console.error('Failed to uninstall extension:', error);
      // TODO: Show error message
    } finally {
      this.state.isLoading = false;
    }
  }

  build() {
    Column() {
      // Header
      Row() {
        Text('EXTENSIONS')
          .fontSize(11)
          .fontWeight(FontWeight.Bold)
          .fontColor('#858585')
          .margin({ left: 20 })

        Blank()

        // View toggle
        Row() {
          Button('Browse')
            .fontSize(12)
            .height(24)
            .backgroundColor(this.state.currentView === 'browse' ? '#0066cc' : Color.Transparent)
            .onClick(() => {
              this.state.currentView = 'browse';
            })

          Button('Installed')
            .fontSize(12)
            .height(24)
            .margin({ left: 5 })
            .backgroundColor(this.state.currentView === 'installed' ? '#0066cc' : Color.Transparent)
            .onClick(() => {
              this.state.currentView = 'installed';
            })
        }
        .margin({ right: 10 })
      }
      .width('100%')
      .height(35)
      .backgroundColor('#f5f5f5')

      // Search bar
      Row() {
        TextInput({
          placeholder: 'Search extensions...',
          text: this.state.searchQuery
        })
          .layoutWeight(1)
          .height(32)
          .fontSize(13)
          .onChange((value: string) => {
            this.state.searchQuery = value;
          })
          .onSubmit(() => {
            this.searchExtensions();
          })

        Button('Search')
          .fontSize(12)
          .height(32)
          .margin({ left: 5 })
          .onClick(() => {
            this.searchExtensions();
          })
      }
      .width('100%')
      .padding(10)
      .backgroundColor('#ffffff')
      .borderWidth({ bottom: 1 })
      .borderColor('#e0e0e0')

      // Content
      if (this.state.currentView === 'details' && this.state.selectedExtension) {
        this.buildDetailsView();
      } else {
        this.buildListView();
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f8f8')
  }

  /**
   * Builds list view
   */
  @Builder
  buildListView() {
    if (this.state.isLoading) {
      Column() {
        LoadingProgress()
          .width(40)
          .height(40)
          .color('#0066cc')
      }
      .width('100%')
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
    } else {
      Scroll() {
        Column() {
          ForEach(this.state.extensions, (extension: MarketplaceExtension) => {
            this.buildExtensionItem(extension);
          })
        }
        .width('100%')
      }
      .width('100%')
      .layoutWeight(1)
      .scrollBar(BarState.Auto)
    }
  }

  /**
   * Builds extension item
   */
  @Builder
  buildExtensionItem(extension: MarketplaceExtension) {
    Row() {
      Column() {
        Text(extension.manifest.displayName)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')

        Text(extension.manifest.description)
          .fontSize(12)
          .fontColor('#666666')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ top: 4 })

        Row() {
          Text(`⭐ ${extension.statistics.rating.toFixed(1)}`)
            .fontSize(11)
            .fontColor('#858585')

          Text(`📥 ${this.formatNumber(extension.statistics.installs)}`)
            .fontSize(11)
            .fontColor('#858585')
            .margin({ left: 10 })

          Text(`v${extension.versions[0].version}`)
            .fontSize(11)
            .fontColor('#858585')
            .margin({ left: 10 })
        }
        .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      Button('Install')
        .fontSize(12)
        .height(28)
        .onClick(() => {
          this.installExtension(extension);
        })
    }
    .width('100%')
    .padding(10)
    .backgroundColor('#ffffff')
    .borderWidth({ bottom: 1 })
    .borderColor('#f0f0f0')
    .onClick(() => {
      this.showExtensionDetails(extension);
    })
    .hoverEffect(HoverEffect.Highlight)
  }

  /**
   * Builds details view
   */
  @Builder
  buildDetailsView() {
    Column() {
      // Back button
      Row() {
        Button('← Back')
          .fontSize(12)
          .height(28)
          .onClick(() => {
            this.state.currentView = 'browse';
            this.state.selectedExtension = null;
          })
      }
      .width('100%')
      .padding(10)

      // Extension details
      Scroll() {
        Column() {
          if (this.state.selectedExtension) {
            const ext = this.state.selectedExtension;

            // Header
            Column() {
              Text(ext.manifest.displayName)
                .fontSize(20)
                .fontWeight(FontWeight.Bold)

              Text(`by ${ext.publisher.displayName}`)
                .fontSize(13)
                .fontColor('#666666')
                .margin({ top: 5 })

              Row() {
                Text(`⭐ ${ext.statistics.rating.toFixed(1)} (${ext.statistics.ratingCount})`)
                  .fontSize(12)
                  .fontColor('#858585')

                Text(`📥 ${this.formatNumber(ext.statistics.installs)} installs`)
                  .fontSize(12)
                  .fontColor('#858585')
                  .margin({ left: 15 })
              }
              .margin({ top: 10 })

              Button('Install')
                .fontSize(14)
                .height(36)
                .width(120)
                .margin({ top: 15 })
                .onClick(() => {
                  this.installExtension(ext);
                })
            }
            .width('100%')
            .alignItems(HorizontalAlign.Start)
            .padding(15)

            // Description
            Column() {
              Text('Description')
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 10 })

              Text(ext.manifest.description)
                .fontSize(13)
                .fontColor('#333333')
            }
            .width('100%')
            .alignItems(HorizontalAlign.Start)
            .padding(15)
          }
        }
        .width('100%')
      }
      .layoutWeight(1)
      .scrollBar(BarState.Auto)
    }
    .width('100%')
    .layoutWeight(1)
  }

  /**
   * Formats number for display
   */
  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
