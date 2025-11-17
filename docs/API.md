# API Documentation

## Core Editor API

### EditorModel

المكون الأساسي لإدارة حالة المحرر.

#### Constructor
```typescript
constructor(content: string = '', options: Partial<EditorOptions> = {})
```

#### Methods

##### getValue()
```typescript
getValue(): string
```
الحصول على محتوى المحرر بالكامل.

##### setValue()
```typescript
setValue(value: string): void
```
تعيين محتوى المحرر.

##### getLine()
```typescript
getLine(lineNumber: number): string
```
الحصول على سطر محدد.

##### insertText()
```typescript
insertText(text: string, position?: Position): void
```
إدخال نص في موضع معين.

##### deleteText()
```typescript
deleteText(range: Range): void
```
حذف نص في نطاق معين.

##### setSelection()
```typescript
setSelection(selection: Selection): void
```
تعيين التحديد الحالي.

#### Events

##### onDidChangeContent
```typescript
onDidChangeContent(listener: (changes: TextChange[]) => void): () => void
```
الاستماع لتغييرات المحتوى.

##### onDidChangeSelection
```typescript
onDidChangeSelection(listener: (selections: Selection[]) => void): () => void
```
الاستماع لتغييرات التحديد.

### EditorController

يتحكم في تفاعلات المستخدم مع المحرر.

#### Methods

##### executeCommand()
```typescript
executeCommand(commandId: string, ...args: any[]): void
```
تنفيذ أمر.

##### registerCommand()
```typescript
registerCommand(command: EditorCommand): void
```
تسجيل أمر جديد.

#### Built-in Commands

- `cursorUp` - تحريك المؤشر لأعلى
- `cursorDown` - تحريك المؤشر لأسفل
- `cursorLeft` - تحريك المؤشر لليسار
- `cursorRight` - تحريك المؤشر لليمين
- `type` - كتابة نص
- `deleteLeft` - حذف لليسار (Backspace)
- `deleteRight` - حذف لليمين (Delete)
- `selectAll` - تحديد الكل

## Language API

### LanguageProvider

توفير دعم للغة برمجية.

#### Constructor
```typescript
constructor(config: LanguageConfiguration)
```

#### Methods

##### tokenize()
```typescript
tokenize(text: string): Token[]
```
تحليل النص إلى tokens.

##### tokenizeLine()
```typescript
tokenizeLine(line: string, lineNumber: number): Token[]
```
تحليل سطر واحد.

### LanguageRegistry

إدارة مزودي اللغات.

#### Methods

##### registerLanguage()
```typescript
registerLanguage(provider: ILanguageProvider): void
```
تسجيل مزود لغة.

##### getLanguageForFile()
```typescript
getLanguageForFile(fileName: string): ILanguageProvider | undefined
```
الحصول على مزود اللغة لملف معين.

## Filesystem API

### FileSystemProvider

عمليات نظام الملفات.

#### Methods

##### readFile()
```typescript
async readFile(path: string): Promise<string>
```
قراءة محتوى ملف.

##### writeFile()
```typescript
async writeFile(path: string, content: string): Promise<void>
```
كتابة محتوى إلى ملف.

##### readDirectory()
```typescript
async readDirectory(path: string): Promise<FileEntry[]>
```
قراءة محتويات مجلد.

##### createDirectory()
```typescript
async createDirectory(path: string): Promise<void>
```
إنشاء مجلد.

##### delete()
```typescript
async delete(path: string, recursive?: boolean): Promise<void>
```
حذف ملف أو مجلد.

### WorkspaceService

إدارة مساحات العمل.

#### Methods

##### addFolder()
```typescript
async addFolder(path: string, name?: string): Promise<void>
```
إضافة مجلد إلى مساحة العمل.

##### getWorkspaceFolders()
```typescript
getWorkspaceFolders(): WorkspaceFolder[]
```
الحصول على جميع المجلدات في مساحة العمل.

##### getSetting()
```typescript
getSetting<T>(key: string, defaultValue?: T): T | undefined
```
الحصول على إعداد.

##### setSetting()
```typescript
setSetting(key: string, value: any): void
```
تعيين إعداد.

## Theme API

### ThemeRegistry

إدارة السمات.

#### Methods

##### registerTheme()
```typescript
registerTheme(theme: Theme): void
```
تسجيل سمة جديدة.

##### getCurrentTheme()
```typescript
getCurrentTheme(): Theme
```
الحصول على السمة الحالية.

##### setCurrentTheme()
```typescript
setCurrentTheme(themeId: string): void
```
تعيين السمة الحالية.

##### onThemeChange()
```typescript
onThemeChange(listener: (theme: Theme) => void): () => void
```
الاستماع لتغييرات السمة.

## Types

### Position
```typescript
interface Position {
  line: number;      // 0-based
  column: number;    // 0-based
}
```

### Range
```typescript
interface Range {
  start: Position;
  end: Position;
}
```

### Selection
```typescript
interface Selection extends Range {
  anchor: Position;
  active: Position;
  isReversed: boolean;
}
```

### Token
```typescript
interface Token {
  type: TokenType;
  value: string;
  startIndex: number;
  endIndex: number;
  line: number;
}
```

### EditorOptions
```typescript
interface EditorOptions {
  tabSize: number;
  insertSpaces: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  wordWrap: boolean;
  fontSize: number;
  fontFamily: string;
  theme: string;
  readOnly: boolean;
}
```

## أمثلة

### مثال: إنشاء محرر بسيط
```typescript
import { EditorModel, EditorController } from '@core/editor';

const model = new EditorModel('Hello World');
const controller = new EditorController(model);

// Listen to changes
model.onDidChangeContent((changes) => {
  console.log('Content changed:', changes);
});

// Type some text
controller.executeCommand('type', ' - Welcome!');

console.log(model.getValue()); // "Hello World - Welcome!"
```

### مثال: إضافة لغة برمجية
```typescript
import { LanguageProvider, languageRegistry } from '@core/language';

const config: LanguageConfiguration = {
  id: 'mylang',
  name: 'My Language',
  extensions: ['.ml'],
  syntaxRules: [
    {
      pattern: /\bfunction\b/,
      tokenType: TokenType.Keyword
    }
  ]
};

const provider = new LanguageProvider(config);
languageRegistry.registerLanguage(provider);
```

### مثال: إنشاء سمة مخصصة
```typescript
import { themeRegistry } from '@ui/themes';

const myTheme: Theme = {
  id: 'ocean',
  name: 'Ocean',
  type: 'dark',
  colors: {
    editorBackground: '#001f3f',
    editorForeground: '#7fdbff',
    // ... more colors
  }
};

themeRegistry.registerTheme(myTheme);
themeRegistry.setCurrentTheme('ocean');
```
