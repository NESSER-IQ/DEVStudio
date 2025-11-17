/**
 * GitPanel Component
 * Source control management panel
 */

import { GitStatus, GitBranch } from '../../services/git/types';
import { gitService } from '../../services/git/GitService';

/**
 * Git panel state
 */
@Observed
class GitPanelState {
  status: GitStatus | null = null;
  branches: GitBranch[] = [];
  commitMessage: string = '';
  isLoading: boolean = false;
  selectedFiles: Set<string> = new Set();
}

/**
 * GitPanel Component
 * Displays Git status and operations
 */
@Component
export struct GitPanel {
  @State private state: GitPanelState = new GitPanelState();
  @Link workspacePath: string;

  /**
   * Initialize
   */
  async aboutToAppear() {
    await this.loadGitStatus();
  }

  /**
   * Loads Git status
   */
  private async loadGitStatus() {
    this.state.isLoading = true;

    try {
      const repo = await gitService.openRepository(this.workspacePath);
      const status = await repo.getStatus();
      const branches = await repo.getBranches();

      this.state.status = status;
      this.state.branches = branches;
    } catch (error) {
      console.error('Failed to load git status:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Stages selected files
   */
  private async stageFiles() {
    if (this.state.selectedFiles.size === 0) {
      return;
    }

    try {
      const repo = gitService.getRepository(this.workspacePath);
      if (!repo) {
        return;
      }

      const files = Array.from(this.state.selectedFiles);
      await repo.stage(files);
      await this.loadGitStatus();
      this.state.selectedFiles.clear();
    } catch (error) {
      console.error('Failed to stage files:', error);
    }
  }

  /**
   * Commits changes
   */
  private async commit() {
    if (!this.state.commitMessage.trim()) {
      return;
    }

    try {
      const repo = gitService.getRepository(this.workspacePath);
      if (!repo) {
        return;
      }

      await repo.commit(this.state.commitMessage);
      this.state.commitMessage = '';
      await this.loadGitStatus();
    } catch (error) {
      console.error('Failed to commit:', error);
    }
  }

  /**
   * Pushes to remote
   */
  private async push() {
    try {
      const repo = gitService.getRepository(this.workspacePath);
      if (!repo) {
        return;
      }

      await repo.push();
      await this.loadGitStatus();
    } catch (error) {
      console.error('Failed to push:', error);
    }
  }

  /**
   * Pulls from remote
   */
  private async pull() {
    try {
      const repo = gitService.getRepository(this.workspacePath);
      if (!repo) {
        return;
      }

      await repo.pull();
      await this.loadGitStatus();
    } catch (error) {
      console.error('Failed to pull:', error);
    }
  }

  /**
   * Toggles file selection
   */
  private toggleFileSelection(file: string) {
    if (this.state.selectedFiles.has(file)) {
      this.state.selectedFiles.delete(file);
    } else {
      this.state.selectedFiles.add(file);
    }
  }

  build() {
    Column() {
      // Header
      Row() {
        Text('SOURCE CONTROL')
          .fontSize(11)
          .fontWeight(FontWeight.Bold)
          .fontColor('#858585')
          .margin({ left: 20 })

        Blank()

        // Current branch
        if (this.state.status) {
          Text(`⎇ ${this.state.status.branch}`)
            .fontSize(12)
            .fontColor('#858585')
            .margin({ right: 10 })
        }
      }
      .width('100%')
      .height(35)
      .backgroundColor('#f5f5f5')

      if (this.state.isLoading) {
        // Loading state
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
            .color('#0066cc')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.state.status) {
        // Git content
        Column() {
          // Commit message input
          Column() {
            TextArea({
              placeholder: 'Commit message',
              text: this.state.commitMessage
            })
              .width('100%')
              .height(60)
              .fontSize(13)
              .backgroundColor('#ffffff')
              .onChange((value: string) => {
                this.state.commitMessage = value;
              })

            Row() {
              Button('Commit')
                .fontSize(12)
                .height(28)
                .enabled(this.state.commitMessage.trim().length > 0)
                .onClick(() => {
                  this.commit();
                })

              Button('Push')
                .fontSize(12)
                .height(28)
                .margin({ left: 5 })
                .onClick(() => {
                  this.push();
                })

              Button('Pull')
                .fontSize(12)
                .height(28)
                .margin({ left: 5 })
                .onClick(() => {
                  this.pull();
                })
            }
            .width('100%')
            .padding({ left: 10, right: 10, top: 5, bottom: 10 })
          }
          .width('100%')
          .backgroundColor('#f5f5f5')
          .borderWidth({ bottom: 1 })
          .borderColor('#e0e0e0')

          // Changes
          Scroll() {
            Column() {
              // Modified files
              if (this.state.status.modified.length > 0) {
                this.buildChangesSection('Modified', this.state.status.modified);
              }

              // Added files
              if (this.state.status.added.length > 0) {
                this.buildChangesSection('Added', this.state.status.added);
              }

              // Deleted files
              if (this.state.status.deleted.length > 0) {
                this.buildChangesSection('Deleted', this.state.status.deleted);
              }

              // Untracked files
              if (this.state.status.untracked.length > 0) {
                this.buildChangesSection('Untracked', this.state.status.untracked);
              }

              // Staged files
              if (this.state.status.staged.length > 0) {
                this.buildChangesSection('Staged', this.state.status.staged);
              }
            }
            .width('100%')
          }
          .layoutWeight(1)
          .scrollBar(BarState.Auto)
        }
        .width('100%')
        .height('100%')
      } else {
        // No repository
        Column() {
          Text('No Git repository found')
            .fontSize(14)
            .fontColor('#858585')

          Button('Initialize Repository')
            .margin({ top: 10 })
            .onClick(async () => {
              try {
                await gitService.initRepository(this.workspacePath);
                await this.loadGitStatus();
              } catch (error) {
                console.error('Failed to initialize repository:', error);
              }
            })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f8f8')
  }

  /**
   * Builds changes section
   */
  @Builder
  buildChangesSection(title: string, files: string[]) {
    Column() {
      Text(title.toUpperCase())
        .fontSize(11)
        .fontWeight(FontWeight.Bold)
        .fontColor('#858585')
        .width('100%')
        .padding({ left: 10, top: 10, bottom: 5 })

      ForEach(files, (file: string) => {
        Row() {
          Checkbox()
            .select(this.state.selectedFiles.has(file))
            .onChange((value: boolean) => {
              this.toggleFileSelection(file);
            })

          Text(file)
            .fontSize(13)
            .fontColor('#333333')
            .margin({ left: 5 })
            .layoutWeight(1)

          Text(this.getStatusIcon(title))
            .fontSize(14)
            .margin({ right: 10 })
        }
        .width('100%')
        .height(28)
        .padding({ left: 10 })
        .onClick(() => {
          // TODO: Show diff
        })
        .hoverEffect(HoverEffect.Highlight)
      })
    }
    .width('100%')
  }

  /**
   * Gets status icon for file
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'Modified': return 'M';
      case 'Added': return 'A';
      case 'Deleted': return 'D';
      case 'Untracked': return 'U';
      case 'Staged': return 'S';
      default: return '?';
    }
  }
}
