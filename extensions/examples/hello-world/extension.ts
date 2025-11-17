/**
 * Hello World Extension
 * A simple extension that shows a "Hello World" message
 */

import * as codeeditor from 'harmonyos-code-editor';

/**
 * Extension activation
 */
export function activate(context: codeeditor.ExtensionContext) {
  console.log('Hello World extension is now active!');

  // Register command
  const disposable = codeeditor.commands.registerCommand(
    'helloWorld.sayHello',
    () => {
      // Show information message
      codeeditor.window.showInformationMessage('Hello World from HarmonyOS Code Editor!');
    }
  );

  // Add to subscriptions for cleanup
  context.subscriptions.push(disposable);

  // Example: Create output channel
  const outputChannel = codeeditor.window.createOutputChannel('Hello World');
  outputChannel.appendLine('Hello World extension activated!');
  outputChannel.appendLine(`Extension path: ${context.extensionPath}`);

  context.subscriptions.push(outputChannel);
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Hello World extension is now deactivated!');
}
