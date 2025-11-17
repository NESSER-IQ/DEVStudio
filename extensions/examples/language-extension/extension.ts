/**
 * Markdown Language Support Extension
 * Provides enhanced Markdown support with preview
 */

import * as codeeditor from 'harmonyos-code-editor';

/**
 * Extension activation
 */
export function activate(context: codeeditor.ExtensionContext) {
  console.log('Markdown Language Support extension is now active!');

  // Register completion provider
  const completionProvider = codeeditor.languages.registerCompletionItemProvider(
    'markdown',
    {
      provideCompletionItems(document, position) {
        // Provide Markdown-specific completions
        return [
          {
            label: '# Heading 1',
            kind: 14, // Snippet
            insertText: '# ${1:Heading}',
            documentation: 'Insert a level 1 heading'
          },
          {
            label: '## Heading 2',
            kind: 14,
            insertText: '## ${1:Heading}',
            documentation: 'Insert a level 2 heading'
          },
          {
            label: '**Bold**',
            kind: 14,
            insertText: '**${1:text}**',
            documentation: 'Make text bold'
          },
          {
            label: '*Italic*',
            kind: 14,
            insertText: '*${1:text}*',
            documentation: 'Make text italic'
          },
          {
            label: '[Link](url)',
            kind: 14,
            insertText: '[${1:text}](${2:url})',
            documentation: 'Insert a link'
          },
          {
            label: '```Code Block```',
            kind: 14,
            insertText: '```${1:language}\n${2:code}\n```',
            documentation: 'Insert a code block'
          },
          {
            label: '- List Item',
            kind: 14,
            insertText: '- ${1:item}',
            documentation: 'Insert a list item'
          }
        ];
      }
    },
    '#', '*', '[', '`', '-'  // Trigger characters
  );

  context.subscriptions.push(completionProvider);

  // Register preview command
  const previewCommand = codeeditor.commands.registerCommand(
    'markdown.showPreview',
    () => {
      codeeditor.window.showInformationMessage('Markdown Preview: Coming soon!');
      // TODO: Implement actual preview functionality
    }
  );

  context.subscriptions.push(previewCommand);

  // Create output channel
  const outputChannel = codeeditor.window.createOutputChannel('Markdown');
  outputChannel.appendLine('Markdown Language Support activated!');

  context.subscriptions.push(outputChannel);
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Markdown Language Support extension is now deactivated!');
}
