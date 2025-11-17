# Extension SDK

## Overview

The HarmonyOS Code Editor Extension SDK provides a rich set of APIs for extending the editor's functionality. Extensions can add commands, language support, themes, keybindings, and more.

## Installation

```bash
npm install --save-dev harmonyos-code-editor-sdk
```

## TypeScript Definitions

The SDK includes full TypeScript definitions for all APIs:

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  // Your extension code with IntelliSense support
}
```

## API Reference

### Commands API

```typescript
namespace commands {
  // Register a command
  function registerCommand(
    command: string,
    callback: (...args: any[]) => any,
    thisArg?: any
  ): Disposable;

  // Execute a command
  function executeCommand<T>(
    command: string,
    ...rest: any[]
  ): Promise<T | undefined>;

  // Get all commands
  function getCommands(filterInternal?: boolean): Promise<string[]>;
}
```

### Window API

```typescript
namespace window {
  // Active text editor
  let activeTextEditor: TextEditor | undefined;

  // Show messages
  function showInformationMessage(message: string, ...items: string[]): Promise<string | undefined>;
  function showWarningMessage(message: string, ...items: string[]): Promise<string | undefined>;
  function showErrorMessage(message: string, ...items: string[]): Promise<string | undefined>;

  // Input box
  function showInputBox(options?: InputBoxOptions): Promise<string | undefined>;

  // Quick pick
  function showQuickPick(
    items: string[] | Promise<string[]>,
    options?: QuickPickOptions
  ): Promise<string | undefined>;

  // Output channel
  function createOutputChannel(name: string): OutputChannel;

  // Decorations
  function createTextEditorDecorationType(
    options: DecorationRenderOptions
  ): TextEditorDecorationType;

  // Events
  function onDidChangeActiveTextEditor(
    listener: (e: TextEditor | undefined) => any
  ): Disposable;
}
```

### Workspace API

```typescript
namespace workspace {
  // Workspace folders
  let workspaceFolders: WorkspaceFolder[] | undefined;

  // Configuration
  function getConfiguration(
    section?: string,
    scope?: any
  ): WorkspaceConfiguration;

  // Text documents
  function openTextDocument(uri: string): Promise<TextDocument>;

  // Events
  function onDidChangeConfiguration(listener: (e: ConfigurationChangeEvent) => any): Disposable;
  function onDidOpenTextDocument(listener: (e: TextDocument) => any): Disposable;
  function onDidCloseTextDocument(listener: (e: TextDocument) => any): Disposable;
}
```

### Languages API

```typescript
namespace languages {
  // Completion provider
  function registerCompletionItemProvider(
    selector: string | string[],
    provider: CompletionItemProvider,
    ...triggerCharacters: string[]
  ): Disposable;

  // Hover provider
  function registerHoverProvider(
    selector: string | string[],
    provider: HoverProvider
  ): Disposable;

  // Definition provider
  function registerDefinitionProvider(
    selector: string | string[],
    provider: DefinitionProvider
  ): Disposable;

  // Reference provider
  function registerReferenceProvider(
    selector: string | string[],
    provider: ReferenceProvider
  ): Disposable;
}
```

## Types

### ExtensionContext

```typescript
interface ExtensionContext {
  readonly manifest: ExtensionManifest;
  readonly extensionPath: string;
  subscriptions: Disposable[];
  globalState: Memento;
  workspaceState: Memento;
  readonly storagePath: string | undefined;
  readonly globalStoragePath: string | undefined;
}
```

### Disposable

```typescript
interface Disposable {
  dispose(): void;
}
```

### TextDocument

```typescript
interface TextDocument {
  readonly uri: string;
  readonly fileName: string;
  readonly languageId: string;
  readonly version: number;
  readonly isDirty: boolean;

  save(): Promise<boolean>;
  getText(range?: Range): string;
  lineAt(line: number): TextLine;
}
```

### TextEditor

```typescript
interface TextEditor {
  readonly document: TextDocument;
  selection: Selection;
  selections: Selection[];
  options: TextEditorOptions;

  edit(callback: (editBuilder: TextEditorEdit) => void): Promise<boolean>;
  setDecorations(decorationType: TextEditorDecorationType, ranges: Range[]): void;
}
```

## Provider Interfaces

### CompletionItemProvider

```typescript
interface CompletionItemProvider {
  provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): CompletionItem[] | Promise<CompletionItem[]>;

  resolveCompletionItem?(
    item: CompletionItem,
    token: CancellationToken
  ): CompletionItem | Promise<CompletionItem>;
}
```

### HoverProvider

```typescript
interface HoverProvider {
  provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Hover | null | Promise<Hover | null>;
}
```

### DefinitionProvider

```typescript
interface DefinitionProvider {
  provideDefinition(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Location | Location[] | null | Promise<Location | Location[] | null>;
}
```

## Example Extension

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  // Register command
  const cmd = codeeditor.commands.registerCommand('ext.hello', () => {
    codeeditor.window.showInformationMessage('Hello!');
  });
  context.subscriptions.push(cmd);

  // Register completion provider
  const provider = codeeditor.languages.registerCompletionItemProvider(
    'javascript',
    {
      provideCompletionItems(document, position) {
        return [
          {
            label: 'console.log',
            kind: codeeditor.CompletionItemKind.Function,
            insertText: 'console.log($1)',
            documentation: 'Logs to console'
          }
        ];
      }
    },
    '.'
  );
  context.subscriptions.push(provider);

  // Create output channel
  const output = codeeditor.window.createOutputChannel('My Extension');
  output.appendLine('Extension activated!');
  context.subscriptions.push(output);
}

export function deactivate() {
  // Cleanup
}
```

## Building Extensions

### Development

```bash
# Install dependencies
npm install

# Compile TypeScript
tsc -p .

# Watch for changes
tsc -watch -p .
```

### Testing

```bash
# Run tests
npm test

# Debug extension
# Press F5 in DevEco Studio
```

### Packaging

```bash
# Create VSIX package
vsce package

# Output: my-extension-1.0.0.vsix
```

## Best Practices

1. **Use TypeScript** for type safety
2. **Dispose resources** properly
3. **Handle errors** gracefully
4. **Document your API** clearly
5. **Write tests** for critical functionality
6. **Follow naming conventions**
7. **Optimize performance**

## Resources

- [Extension Development Guide](../docs/EXTENSION_DEVELOPMENT.md)
- [API Reference](../docs/EXTENSION_API.md)
- [Sample Extensions](./examples/)

## Support

For questions and issues:
- GitHub Issues: https://github.com/NESSER-IQ/DEVStudio/issues
- Documentation: https://docs.example.com
- Discussions: https://github.com/NESSER-IQ/DEVStudio/discussions
