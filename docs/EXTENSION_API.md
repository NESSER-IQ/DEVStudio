# Extension API Documentation

> **ملاحظة**: نظام الإضافات قيد التطوير حالياً. هذا التوثيق يمثل التصميم المخطط.

## نظرة عامة

يوفر HarmonyOS Code Editor نظام إضافات قوي يسمح للمطورين بتوسيع وظائف المحرر.

## بنية الإضافة

### package.json

كل إضافة يجب أن تحتوي على `package.json`:

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "publisher": "my-publisher",
  "displayName": "My Extension",
  "description": "Description of my extension",
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "myExtension.helloWorld",
        "title": "Hello World"
      }
    ],
    "languages": [
      {
        "id": "mylang",
        "extensions": [".ml"],
        "configuration": "./language-configuration.json"
      }
    ],
    "themes": [
      {
        "label": "My Theme",
        "uiTheme": "vs-dark",
        "path": "./themes/my-theme.json"
      }
    ]
  },
  "activationEvents": [
    "onCommand:myExtension.helloWorld",
    "onLanguage:mylang"
  ]
}
```

### Extension Entry Point

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  console.log('Extension activated');

  // Register a command
  const disposable = codeeditor.commands.registerCommand(
    'myExtension.helloWorld',
    () => {
      codeeditor.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('Extension deactivated');
}
```

## Extension APIs

### Commands API

#### Register Command
```typescript
codeeditor.commands.registerCommand(
  commandId: string,
  callback: (...args: any[]) => any
): Disposable
```

#### Execute Command
```typescript
codeeditor.commands.executeCommand(
  commandId: string,
  ...args: any[]
): Promise<any>
```

### Window API

#### Show Message
```typescript
codeeditor.window.showInformationMessage(message: string): Promise<void>
codeeditor.window.showWarningMessage(message: string): Promise<void>
codeeditor.window.showErrorMessage(message: string): Promise<void>
```

#### Input Box
```typescript
codeeditor.window.showInputBox(options: InputBoxOptions): Promise<string | undefined>
```

#### Quick Pick
```typescript
codeeditor.window.showQuickPick(
  items: string[] | QuickPickItem[],
  options?: QuickPickOptions
): Promise<string | QuickPickItem | undefined>
```

### Workspace API

#### Get Workspace Folders
```typescript
codeeditor.workspace.workspaceFolders: WorkspaceFolder[] | undefined
```

#### Open Text Document
```typescript
codeeditor.workspace.openTextDocument(
  uri: Uri
): Promise<TextDocument>
```

#### On Did Change Configuration
```typescript
codeeditor.workspace.onDidChangeConfiguration(
  listener: (event: ConfigurationChangeEvent) => void
): Disposable
```

### Languages API

#### Register Language Provider
```typescript
codeeditor.languages.registerLanguageProvider(
  languageId: string,
  provider: LanguageProvider
): Disposable
```

#### Register Completion Provider
```typescript
codeeditor.languages.registerCompletionItemProvider(
  languageId: string,
  provider: CompletionItemProvider
): Disposable
```

#### Register Hover Provider
```typescript
codeeditor.languages.registerHoverProvider(
  languageId: string,
  provider: HoverProvider
): Disposable
```

### Text Editor API

#### Active Text Editor
```typescript
codeeditor.window.activeTextEditor: TextEditor | undefined
```

#### Edit Document
```typescript
textEditor.edit((editBuilder: TextEditorEdit) => {
  editBuilder.insert(position, text);
  editBuilder.delete(range);
  editBuilder.replace(range, text);
}): Promise<boolean>
```

### Decorations API

#### Create Text Editor Decoration Type
```typescript
codeeditor.window.createTextEditorDecorationType(
  options: DecorationRenderOptions
): TextEditorDecorationType
```

## أمثلة

### مثال 1: Hello World Command

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  const command = codeeditor.commands.registerCommand(
    'extension.helloWorld',
    () => {
      codeeditor.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(command);
}
```

### مثال 2: Language Provider

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  const provider = new MyLanguageProvider();

  const registration = codeeditor.languages.registerLanguageProvider(
    'mylang',
    provider
  );

  context.subscriptions.push(registration);
}

class MyLanguageProvider implements codeeditor.LanguageProvider {
  provideCompletionItems(
    document: codeeditor.TextDocument,
    position: codeeditor.Position
  ): codeeditor.CompletionItem[] {
    return [
      {
        label: 'myfunction',
        kind: codeeditor.CompletionItemKind.Function,
        insertText: 'myfunction()',
        documentation: 'My custom function'
      }
    ];
  }
}
```

### مثال 3: Decoration

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export function activate(context: codeeditor.ExtensionContext) {
  const decorationType = codeeditor.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    border: '1px solid red'
  });

  const editor = codeeditor.window.activeTextEditor;
  if (editor) {
    const range = new codeeditor.Range(
      new codeeditor.Position(0, 0),
      new codeeditor.Position(0, 10)
    );

    editor.setDecorations(decorationType, [range]);
  }
}
```

### مثال 4: File System

```typescript
import * as codeeditor from 'harmonyos-code-editor';

export async function activate(context: codeeditor.ExtensionContext) {
  // Read file
  const uri = codeeditor.Uri.file('/path/to/file.txt');
  const content = await codeeditor.workspace.fs.readFile(uri);

  // Write file
  await codeeditor.workspace.fs.writeFile(
    uri,
    Buffer.from('Hello World')
  );

  // Watch file changes
  const watcher = codeeditor.workspace.createFileSystemWatcher('**/*.js');
  watcher.onDidChange((uri) => {
    console.log('File changed:', uri.fsPath);
  });

  context.subscriptions.push(watcher);
}
```

## Extension Permissions

الإضافات تحتاج لتحديد الصلاحيات المطلوبة:

```json
{
  "permissions": [
    "workspace.read",
    "workspace.write",
    "network.fetch",
    "clipboard.read",
    "clipboard.write"
  ]
}
```

## Publishing Extensions

### 1. Package Extension
```bash
vsce package
```

### 2. Publish to Marketplace
```bash
vsce publish
```

### 3. Update Extension
```bash
# Update version in package.json
vsce publish patch  # 1.0.0 -> 1.0.1
vsce publish minor  # 1.0.0 -> 1.1.0
vsce publish major  # 1.0.0 -> 2.0.0
```

## Best Practices

1. **أمان**
   - لا تستخدم eval()
   - تحقق من جميع المدخلات
   - استخدم الصلاحيات اللازمة فقط

2. **أداء**
   - استخدم lazy loading
   - تجنب العمليات الثقيلة في activation
   - استخدم workers للعمليات المكلفة

3. **تجربة المستخدم**
   - وفر feedback واضح
   - تعامل مع الأخطاء بشكل صحيح
   - احترم إعدادات المستخدم

4. **توثيق**
   - وثق API الخاص بك
   - أضف أمثلة للاستخدام
   - اكتب README واضح

## الموارد

- [Extension Examples](https://github.com/NESSER-IQ/DEVStudio/tree/main/extensions/examples)
- [API Reference](./API.md)
- [Extension Guidelines](./EXTENSION_GUIDELINES.md)

---

للمزيد من المعلومات أو الدعم، راجع [GitHub Discussions](https://github.com/NESSER-IQ/DEVStudio/discussions).
