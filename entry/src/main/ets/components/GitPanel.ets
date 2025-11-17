/**
 * GitPanel Component - Git version control interface
 * Shows status, changes, branches with visual diff
 * v1.1 Feature
 */

import { gitService, GitStatus, GitBranch, GitCommit } from '../services/GitService';

@Component
export struct GitPanel {
  @State currentTab: string = 'changes';
  @State gitStatus: GitStatus | null = null;
  @State branches: GitBranch[] = [];
  @State commits: GitCommit[] = [];
  @State commitMessage: string = '';
  @State isLoading: boolean = false;

  private tabs = [
    { id: 'changes', label: 'Changes', icon: '📝' },
    { id: 'branches', label: 'Branches', icon: '🌿' },
    { id: 'history', label: 'History', icon: '📜' }
  ];

  aboutToAppear() {
    this.refreshGitStatus();
  }

  async refreshGitStatus() {
    this.isLoading = true;
    this.gitStatus = await gitService.getStatus();
    this.branches = await gitService.getBranches();
    this.commits = await gitService.getLog(20);
    this.isLoading = false;
  }

  build() {
    Column() {
      // Header
      Row() {
        Text('🌿')
          .fontSize(16)
          .margin({ right: 8 })

        Text('Git')
          .fontSize(11)
          .fontColor($r('app.color.text_secondary'))
          .fontWeight(FontWeight.Bold)
          .textTransform(TextTransform.Uppercase)
          .layoutWeight(1)

        // Refresh button
        Button() {
          Text('🔄')
            .fontSize(14)
        }
        .backgroundColor('transparent')
        .width(24)
        .height(24)
        .onClick(() => {
          this.refreshGitStatus();
        })
      }
      .width('100%')
      .height(35)
      .padding({ left: 12, right: 8 })
      .backgroundColor($r('app.color.secondary_bg'))

      Divider()
        .color($r('app.color.border'))

      // Tabs
      Row() {
        ForEach(this.tabs, (tab: { id: string, label: string, icon: string }) => {
          Row({ space: 4 }) {
            Text(tab.icon)
              .fontSize(11)

            Text(tab.label)
              .fontSize(11)
              .fontColor(this.currentTab === tab.id ?
                $r('app.color.text_primary') : $r('app.color.text_secondary'))
          }
          .padding({ left: 8, right: 8, top: 6, bottom: 6 })
          .backgroundColor(this.currentTab === tab.id ? '#37373D' : 'transparent')
          .borderRadius(4)
          .onClick(() => {
            this.currentTab = tab.id;
          })
        })
      }
      .width('100%')
      .padding(8)

      Divider()
        .color($r('app.color.border'))

      // Content
      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(24)
            .height(24)
            .color($r('app.color.accent'))
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Column() {
          if (this.currentTab === 'changes') {
            this.ChangesContent()
          } else if (this.currentTab === 'branches') {
            this.BranchesContent()
          } else if (this.currentTab === 'history') {
            this.HistoryContent()
          }
        }
        .layoutWeight(1)
        .width('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.secondary_bg'))
  }

  @Builder
  ChangesContent() {
    Column() {
      if (!this.gitStatus) {
        Text('Not a git repository')
          .fontSize(12)
          .fontColor($r('app.color.text_secondary'))
          .padding(12)
      } else {
        Scroll() {
          Column() {
            // Current branch
            Row() {
              Text('Branch:')
                .fontSize(11)
                .fontColor($r('app.color.text_secondary'))
                .margin({ right: 8 })

              Text(this.gitStatus.branch)
                .fontSize(12)
                .fontColor($r('app.color.text_primary'))
                .fontWeight(FontWeight.Medium)
            }
            .width('100%')
            .padding(12)

            Divider()
              .color($r('app.color.border'))

            // Staged changes
            if (this.gitStatus.staged.length > 0) {
              this.FileSection('Staged Changes', this.gitStatus.staged, 'gitAdded')
            }

            // Unstaged changes
            if (this.gitStatus.unstaged.length > 0) {
              this.FileSection('Unstaged Changes', this.gitStatus.unstaged, 'gitModified')
            }

            // Untracked files
            if (this.gitStatus.untracked.length > 0) {
              this.FileSection('Untracked Files', this.gitStatus.untracked, 'gitAdded')
            }

            // Commit section
            if (this.gitStatus.staged.length > 0) {
              Divider()
                .color($r('app.color.border'))
                .margin({ top: 12 })

              Column({ space: 8 }) {
                TextInput({
                  placeholder: 'Commit message...',
                  text: this.commitMessage
                })
                  .fontSize(12)
                  .backgroundColor($r('app.color.tertiaryBg'))
                  .onChange((value: string) => {
                    this.commitMessage = value;
                  })

                Row({ space: 8 }) {
                  Button('Commit')
                    .fontSize(12)
                    .backgroundColor($r('app.color.accent'))
                    .layoutWeight(1)
                    .onClick(async () => {
                      if (this.commitMessage.trim()) {
                        await gitService.commit(this.commitMessage);
                        this.commitMessage = '';
                        this.refreshGitStatus();
                      }
                    })

                  Button('Push')
                    .fontSize(12)
                    .backgroundColor($r('app.color.success'))
                    .layoutWeight(1)
                    .onClick(async () => {
                      await gitService.push();
                      this.refreshGitStatus();
                    })
                }
              }
              .padding(12)
            }
          }
        }
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  FileSection(title: string, files: string[], colorType: string) {
    Column() {
      Text(title)
        .fontSize(11)
        .fontColor($r('app.color.text_secondary'))
        .fontWeight(FontWeight.Medium)
        .padding(12)

      ForEach(files, (file: string) => {
        Row() {
          Text(this.getFileStatusIcon(colorType))
            .fontSize(12)
            .margin({ right: 8 })

          Text(file)
            .fontSize(12)
            .fontColor($r('app.color.text_primary'))
            .layoutWeight(1)
        }
        .width('100%')
        .padding({ left: 12, right: 12, top: 6, bottom: 6 })
        .backgroundColor('#2D2D30')
        .margin({ bottom: 2 })
      })
    }
    .width('100%')
  }

  getFileStatusIcon(type: string): string {
    switch (type) {
      case 'gitAdded':
        return '✚';
      case 'gitModified':
        return '●';
      case 'gitDeleted':
        return '✖';
      default:
        return '●';
    }
  }

  @Builder
  BranchesContent() {
    Scroll() {
      Column() {
        ForEach(this.branches, (branch: GitBranch) => {
          Row() {
            Text(branch.current ? '●' : '○')
              .fontSize(12)
              .fontColor(branch.current ? $r('app.color.accent') : $r('app.color.text_secondary'))
              .margin({ right: 8 })

            Text(branch.name)
              .fontSize(12)
              .fontColor(branch.current ? $r('app.color.text_primary') : $r('app.color.text_secondary'))
              .fontWeight(branch.current ? FontWeight.Bold : FontWeight.Normal)
              .layoutWeight(1)
          }
          .width('100%')
          .padding(12)
          .backgroundColor(branch.current ? '#37373D' : 'transparent')
          .onClick(async () => {
            if (!branch.current) {
              await gitService.checkout(branch.name);
              this.refreshGitStatus();
            }
          })
        })
      }
    }
    .layoutWeight(1)
    .scrollBar(BarState.Auto)
  }

  @Builder
  HistoryContent() {
    Scroll() {
      Column() {
        ForEach(this.commits, (commit: GitCommit) => {
          Column({ space: 4 }) {
            Row() {
              Text(commit.hash.substring(0, 7))
                .fontSize(11)
                .fontColor($r('app.color.accent'))
                .fontFamily('monospace')
                .margin({ right: 8 })

              Text(commit.author)
                .fontSize(11)
                .fontColor($r('app.color.text_secondary'))
            }
            .width('100%')

            Text(commit.message)
              .fontSize(12)
              .fontColor($r('app.color.text_primary'))
              .maxLines(2)
              .textOverflow({ overflow: TextOverflow.Ellipsis })

            Text(commit.date)
              .fontSize(10)
              .fontColor($r('app.color.text_secondary'))
          }
          .width('100%')
          .padding(12)
          .backgroundColor('#2D2D30')
          .borderRadius(4)
          .margin({ bottom: 8 })
        })
      }
      .padding(12)
    }
    .layoutWeight(1)
    .scrollBar(BarState.Auto)
  }
}
