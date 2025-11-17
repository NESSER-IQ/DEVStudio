# Extension Development Guide

## Getting Started

This guide will help you create your first extension for HarmonyOS Code Editor.

## Prerequisites

- DevEco Studio 4.0+
- Node.js 16+
- TypeScript knowledge
- Basic understanding of HarmonyOS development

## Extension Structure

A typical extension has the following structure:

```
my-extension/
├── package.json          # Extension manifest
├── extension.ts         # Extension entry point
├── out/                # Compiled JavaScript
│   └── extension.js
├── src/                # Source code
│   └── ...
├── themes/             # Themes (optional)
├── snippets/           # Code snippets (optional)
└── README.md          # Documentation
```

## Creating Your First Extension

### 1. Initialize Extension

Create a new directory and initialize package.json:

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "version": "0.0.1",
  "publisher": "your-publisher-name",
  "description": "My awesome extension",
  "categories": ["Other"],
  "activationEvents": [
    "onCommand:myExtension.helloWorld"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "myExtension.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "engines": {
    "harmonyos": "^1.0.0"
  }
}
```

### 2. Create Extension Entry Point

Create `extension.ts`:

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  console.log('Extension activated!');

  const disposable = codeeditor.commands.registerCommand(
    'myExtension.helloWorld',
    () => {
      codeeditor.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('Extension deactivated!');
}
```

### 3. Compile TypeScript

Add tsconfig.json:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "out",
    "lib": ["ES2020"],
    "sourceMap": true,
    "strict": true
  },
  "include": ["extension.ts"]
}
```

Compile: `tsc -p .`

### 4. Test Your Extension

Load your extension in the editor:

1. Open Extensions view (Ctrl+Shift+X)
2. Click "..." menu > "Install from VSIX"
3. Select your extension folder
4. Press F5 to test

## Extension Manifest (package.json)

### Required Fields

- `name`: Unique extension identifier
- `version`: Semantic version (e.g., "1.0.0")
- `publisher`: Publisher identifier
- `engines`: Compatible editor versions

### Optional Fields

- `displayName`: Human-readable name
- `description`: Short description
- `categories`: Extension categories
- `keywords`: Search keywords
- `icon`: Extension icon path
- `license`: License identifier

### Activation Events

Specify when your extension should be activated:

```json
{
  "activationEvents": [
    "onLanguage:javascript",     // When JS file opens
    "onCommand:myExt.command",   // When command executed
    "onView:myView",            // When custom view shown
    "*"                          // On startup (use sparingly)
  ]
}
```

### Contributions

Declare what your extension contributes:

#### Commands

```json
{
  "contributes": {
    "commands": [
      {
        "command": "myExt.doSomething",
        "title": "Do Something",
        "category": "My Extension"
      }
    ]
  }
}
```

#### Languages

```json
{
  "contributes": {
    "languages": [
      {
        "id": "mylang",
        "extensions": [".ml"],
        "aliases": ["MyLang"],
        "configuration": "./language-configuration.json"
      }
    ]
  }
}
```

#### Themes

```json
{
  "contributes": {
    "themes": [
      {
        "id": "mytheme",
        "label": "My Theme",
        "uiTheme": "dark",
        "path": "./themes/mytheme.json"
      }
    ]
  }
}
```

#### Keybindings

```json
{
  "contributes": {
    "keybindings": [
      {
        "command": "myExt.command",
        "key": "ctrl+shift+a",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

## Extension API

### Commands

```typescript
// Register a command
commands.registerCommand('myExt.cmd', (arg) => {
  // Command logic
});

// Execute a command
commands.executeCommand('myExt.cmd', arg);
```

### Window

```typescript
// Show messages
window.showInformationMessage('Info');
window.showWarningMessage('Warning');
window.showErrorMessage('Error');

// Input box
const input = await window.showInputBox({
  prompt: 'Enter value',
  placeHolder: 'Placeholder'
});

// Quick pick
const choice = await window.showQuickPick(
  ['Option 1', 'Option 2'],
  { placeHolder: 'Select option' }
);

// Output channel
const channel = window.createOutputChannel('My Extension');
channel.appendLine('Log message');
channel.show();

// Text editor
const editor = window.activeTextEditor;
if (editor) {
  const document = editor.document;
  const selection = editor.selection;
}
```

### Workspace

```typescript
// Configuration
const config = workspace.getConfiguration('myExt');
const value = config.get('setting');
config.update('setting', newValue);

// Files
const folders = workspace.workspaceFolders;
const doc = await workspace.openTextDocument(uri);

// Events
workspace.onDidChangeConfiguration((e) => {
  if (e.affectsConfiguration('myExt')) {
    // Handle config change
  }
});
```

### Languages

```typescript
// Completion provider
languages.registerCompletionItemProvider('javascript', {
  provideCompletionItems(document, position) {
    return [
      {
        label: 'myFunction',
        kind: CompletionItemKind.Function,
        insertText: 'myFunction($1)',
        documentation: 'My function'
      }
    ];
  }
}, '.');

// Hover provider
languages.registerHoverProvider('javascript', {
  provideHover(document, position) {
    return {
      contents: ['**myFunction**\n\nDoes something cool']
    };
  }
});
```

## Best Practices

### 1. Performance

- Use activation events wisely
- Lazy-load heavy dependencies
- Dispose resources properly

```typescript
export function activate(context: ExtensionContext) {
  const provider = new MyProvider();
  context.subscriptions.push(
    languages.registerCompletionItemProvider('js', provider)
  );
}
```

### 2. Error Handling

```typescript
try {
  // Risky operation
} catch (error) {
  window.showErrorMessage(`Operation failed: ${error.message}`);
  console.error(error);
}
```

### 3. User Experience

- Provide clear feedback
- Use descriptive names
- Write good documentation

### 4. Testing

Write tests for your extension:

```typescript
import * as assert from 'assert';
import * as codeeditor from 'harmonyos-code-editor';

suite('Extension Tests', () => {
  test('Command registration', async () => {
    await codeeditor.commands.executeCommand('myExt.cmd');
    // Assert results
  });
});
```

## Publishing

### 1. Package Extension

```bash
vsce package
```

This creates a `.vsix` file.

### 2. Publish to Marketplace

```bash
vsce publish
```

### 3. Update Extension

```bash
# Patch version (1.0.0 -> 1.0.1)
vsce publish patch

# Minor version (1.0.0 -> 1.1.0)
vsce publish minor

# Major version (1.0.0 -> 2.0.0)
vsce publish major
```

## Examples

See the `extensions/examples/` directory for complete examples:

- **hello-world**: Basic command extension
- **theme-extension**: Custom theme
- **language-extension**: Language support

## Resources

- [Extension API Reference](./EXTENSION_API.md)
- [Sample Extensions](../extensions/examples/)
- [HarmonyOS Documentation](https://developer.harmonyos.com/)

## Getting Help

- [GitHub Issues](https://github.com/NESSER-IQ/DEVStudio/issues)
- [Discussions](https://github.com/NESSER-IQ/DEVStudio/discussions)
- [Documentation](./README.md)

## License

MIT
