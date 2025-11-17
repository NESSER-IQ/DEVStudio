# البنية المعمارية لـ ArkStudio 🏗️

<div dir="rtl">

## نظرة عامة

**ArkStudio** مبني على بنية معمارية حديثة تجمع بين قوة Monaco Editor ومرونة LSP (Language Server Protocol) وقدرات HarmonyOS الأصلية.

---

## 📐 نمط المعمارية

### 1. Component-Based Architecture

التطبيق مبني على مكونات ArkUI قابلة لإعادة الاستخدام:

```
┌─────────────────────────────────────────────┐
│           EntryAbility (نقطة الدخول)         │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────▼────────┐
         │   Index Page    │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐  ┌─────▼─────┐  ┌───▼────┐
│Topbar │  │  Content  │  │Sidebar │
└───────┘  └─────┬─────┘  └────────┘
                 │
        ┌────────┼────────┐
        │        │        │
   ┌────▼───┐ ┌─▼──────┐ ┌▼──────┐
   │Explorer│ │ Editor │ │Bottom │
   └────────┘ └────────┘ └───────┘
```

### 2. Service Layer Pattern

الخدمات (Services) تتعامل مع منطق العمل (Business Logic):

```
┌──────────────────────────────────────┐
│         Presentation Layer           │
│      (Components & Pages)            │
└────────────┬─────────────────────────┘
             │
┌────────────▼─────────────────────────┐
│         Service Layer                │
│  ┌────────────────────────────────┐  │
│  │  FileSystemService             │  │
│  ├────────────────────────────────┤  │
│  │  LSPClient                     │  │
│  ├────────────────────────────────┤  │
│  │  GitService                    │  │
│  └────────────────────────────────┘  │
└────────────┬─────────────────────────┘
             │
┌────────────▼─────────────────────────┐
│       HarmonyOS APIs                 │
│  (FileIO, Process, Network, etc.)    │
└──────────────────────────────────────┘
```

---

## 🧩 المكونات الرئيسية

### 1. Monaco Editor Integration

#### التحدي
كيف ندمج محرر ويب (Monaco) في تطبيق أصلي (Native)?

#### الحل
استخدام **WebView** مع **JavaScript Bridge**:

```typescript
// MonacoEditor.ets
Web({
  src: $rawfile('monaco/index.html'),
  controller: this.controller
})
  .javaScriptAccess(true)
  .onPageEnd(() => {
    this.controller.runJavaScript(`
      setEditorContent('${content}')
    `);
  })
```

```html
<!-- monaco/index.html -->
<script>
  // تحميل Monaco من CDN
  require.config({
    paths: { 'vs': 'https://cdn.../monaco-editor/min/vs' }
  });

  require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(...);
  });

  // API للتواصل مع ArkTS
  function setEditorContent(content) {
    window.editor.setValue(content);
  }
</script>
```

#### تدفق البيانات

```
ArkTS ──────────────────────> Monaco
       runJavaScript()
       setEditorContent()

Monaco ──────────────────────> ArkTS
       console.log()
       window callbacks
```

---

### 2. Language Server Protocol (LSP)

#### البنية

```
┌──────────────────────────────────────────────┐
│            Monaco Editor                     │
│  (يرسل طلبات: completion, hover, etc.)       │
└────────────┬─────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────┐
│          LSPClient (ArkTS)                   │
│  • registerLanguageServer()                  │
│  • startLanguageServer()                     │
│  • getCompletions()                          │
│  • getDiagnostics()                          │
└────────────┬─────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────┐
│     Language Servers (Processes)             │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ TypeScript LS│  │  Python LS   │  ...     │
│  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────┘
```

#### مثال: إضافة دعم لغة جديدة

```typescript
// تسجيل خادم Python
lspClient.registerLanguageServer({
  languageId: 'python',
  command: 'pylsp',  // Python Language Server
  args: ['--tcp', '--port', '2087']
});

// بدء الخادم
await lspClient.startLanguageServer('python');

// الآن يمكن للمحرر استخدامه تلقائياً
```

#### بروتوكول التواصل

LSP يستخدم JSON-RPC 2.0:

```json
// طلب من العميل (Client)
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "textDocument/completion",
  "params": {
    "textDocument": { "uri": "file:///path/to/file.py" },
    "position": { "line": 10, "character": 5 }
  }
}

// رد من الخادم (Server)
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "items": [
      { "label": "print", "kind": 3, "detail": "built-in function" }
    ]
  }
}
```

---

### 3. File System Service

#### الهيكل

```typescript
export class FileSystemService {
  // القراءة
  async readFile(path: string): Promise<string>
  async getFileTree(dir: string): Promise<FileNode[]>

  // الكتابة
  async writeFile(path: string, content: string): Promise<boolean>
  async createFile(path: string): Promise<boolean>
  async createDirectory(path: string): Promise<boolean>

  // الإدارة
  async deleteFile(path: string): Promise<boolean>
  async rename(old: string, new: string): Promise<boolean>
}
```

#### التخزين في HarmonyOS

```
/data/storage/el2/base/
├── haps/
│   └── entry/
│       └── files/          ← مساحة التطبيق
│           ├── projects/   ← مشاريع المستخدم
│           │   ├── project1/
│           │   └── project2/
│           └── temp/       ← ملفات مؤقتة
```

#### FileNode Model

```typescript
class FileNode {
  name: string;              // اسم الملف
  path: string;              // المسار الكامل
  isDirectory: boolean;      // مجلد أم ملف؟
  size?: number;             // الحجم
  lastModified?: number;     // تاريخ التعديل
  children?: FileNode[];     // الأبناء (للمجلدات)
}
```

---

### 4. Git Integration

#### البنية

```typescript
export class GitService {
  private workingDirectory: string;

  // عمليات Git الأساسية
  async clone(url: string, path: string): Promise<boolean>
  async commit(message: string): Promise<boolean>
  async push(remote: string, branch: string): Promise<boolean>
  async pull(remote: string, branch: string): Promise<boolean>

  // معلومات المستودع
  async getStatus(): Promise<GitStatus>
  async getBranches(): Promise<GitBranch[]>
  async getLog(limit: number): Promise<GitCommit[]>
}
```

#### التنفيذ

في MVP، Git يعمل عبر تنفيذ أوامر shell:

```typescript
private async executeGitCommand(args: string[]): Promise<string> {
  // استخدام Process API
  const result = await process.exec('git', args, {
    cwd: this.workingDirectory
  });
  return result.stdout;
}
```

**مستقبلاً**: يمكن استخدام مكتبة Git native (مثل libgit2) لأداء أفضل.

---

## 🔄 تدفق البيانات

### مثال: فتح ملف

```
┌──────────────┐
│  User Action │  (المستخدم يضغط على ملف)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ FileExplorer │  selectFile(node)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│FileSystemService │  readFile(path)
└──────┬───────────┘
       │ FileIO API
       ▼
┌──────────────┐
│  HarmonyOS   │  fs.readSync()
└──────┬───────┘
       │
       ▼ content
┌──────────────┐
│ Index Page   │  onFileSelected(path, content)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│MonacoEditor  │  setEditorContent(content)
└──────┬───────┘
       │ JavaScript Bridge
       ▼
┌──────────────┐
│    Monaco    │  editor.setValue(content)
└──────────────┘
```

### مثال: Auto-completion (مستقبلاً)

```
User types "console." in Monaco
         │
         ▼
Monaco detects trigger character '.'
         │
         ▼
Monaco calls LSP textDocument/completion
         │
         ▼
LSPClient receives request
         │
         ▼
LSPClient forwards to TypeScript Server
         │
         ▼
TypeScript Server analyzes code
         │
         ▼
Returns completion items
         │
         ▼
Monaco displays suggestions
```

---

## 📱 Adaptive UI Strategy

### نقاط التوقف (Breakpoints)

```typescript
// الكشف عن نوع الجهاز
enum DeviceType {
  Compact,   // < 600dp  (الهواتف)
  Medium,    // 600-840dp (أجهزة لوحية صغيرة)
  Large      // > 840dp  (أجهزة لوحية كبيرة، 2in1)
}
```

### التخطيطات

#### Compact (الهواتف)
```
┌─────────────────────┐
│     Top Bar         │
├──┬──────────────────┤
│S │                  │
│i │     Editor       │
│d │                  │
│e │                  │
│  ├──────────────────┤
│  │  Bottom (slide) │
└──┴──────────────────┘

• File Explorer: Slide from left
• Sidebar: Always visible (narrow)
• Editor: Full width
• Bottom Panel: Slide from bottom
```

#### Large (الأجهزة اللوحية)
```
┌────────────────────────────┐
│        Top Bar             │
├──┬────┬─────────────┬──────┤
│  │    │             │      │
│S │ F  │             │      │
│i │ i  │   Editor    │      │
│d │ l  │             │      │
│e │ e  │             │      │
│  │ s  ├─────────────┤      │
│  │    │   Bottom    │      │
└──┴────┴─────────────┴──────┘

• All panels visible simultaneously
• Resizable panels
• VS Code-like experience
```

---

## 🌐 الوضع الموزع (Future)

### المفهوم

توزيع واجهة التطبيق عبر أجهزة متعددة:

```
┌─────────────┐          ┌─────────────┐
│   Phone     │          │   Tablet    │
│             │          │             │
│  ┌───────┐  │  ─────>  │  ┌───────┐  │
│  │Editor │  │  Mirror  │  │Preview│  │
│  └───────┘  │          │  └───────┘  │
└─────────────┘          └─────────────┘
```

### التقنية: DSoftBus

HarmonyOS يوفر DSoftBus للتواصل بين الأجهزة:

```typescript
// إرسال لوحة المعاينة إلى جهاز لوحي
distributedObject.setSessionId(sessionId);
distributedObject.on('statusChanged', (status) => {
  if (status === 'online') {
    // إرسال بيانات المعاينة
    distributedObject.preview = {
      content: htmlContent,
      type: 'html'
    };
  }
});
```

---

## 🔐 الأمان

### File Access Permissions

```json
// module.json5
"requestPermissions": [
  {
    "name": "ohos.permission.FILE_ACCESS_MANAGER",
    "reason": "$string:file_access_reason"
  }
]
```

### WebView Security

```typescript
Web({ src: $rawfile('monaco/index.html') })
  .javaScriptAccess(true)           // للتواصل مع Monaco
  .domStorageAccess(true)            // للتخزين المحلي
  .fileAccess(true)                  // لقراءة الملفات
  .mixedMode(MixedMode.Compatible)   // للـ CDN
```

---

## 🚀 الأداء

### تحسينات

1. **Lazy Loading**
   ```typescript
   // تحميل الملفات عند الطلب فقط
   if (isExpanded) {
     children = await loadChildren(path);
   }
   ```

2. **Virtual Scrolling**
   ```typescript
   // عرض العناصر المرئية فقط
   List() {
     LazyForEach(dataSource, (item) => {
       ListItem() { ... }
     })
   }
   ```

3. **Monaco Optimizations**
   ```javascript
   monaco.editor.create(container, {
     minimap: { enabled: false },  // تعطيل Minimap على الهواتف
     renderWhitespace: 'none',     // عدم رسم المسافات
     scrollBeyondLastLine: false   // توفير الذاكرة
   });
   ```

---

## 🧪 الاختبار

### استراتيجية الاختبار

```
Unit Tests
├── Services
│   ├── FileSystemService.test.ets
│   ├── LSPClient.test.ets
│   └── GitService.test.ets
├── Models
│   └── FileNode.test.ets
└── Utils
    └── helpers.test.ets

Integration Tests
├── FileExplorer → FileSystemService
├── MonacoEditor → LSPClient
└── Git Panel → GitService

UI Tests
├── Navigation flow
├── File operations
└── Editor functionality
```

---

## 📊 Monitoring & Logging

```typescript
import { hilog } from '@kit.PerformanceAnalysisKit';

// استخدام HiLog للسجلات
hilog.info(0x0000, 'ArkStudio', 'File opened: %{public}s', filePath);
hilog.error(0x0000, 'ArkStudio', 'Failed to read file: %{public}s', error);
```

---

## 🔮 المستقبل

### Ark Copilot Architecture

```
┌─────────────────────────────────────┐
│         Monaco Editor               │
└───────────┬─────────────────────────┘
            │
┌───────────▼─────────────────────────┐
│       Ark Copilot Service           │
│  • Code completion                  │
│  • Code explanation                 │
│  • Migration (Android→HarmonyOS)    │
│  • Bug detection                    │
└───────────┬─────────────────────────┘
            │
┌───────────▼─────────────────────────┐
│        AI Model API                 │
│  (OpenAI, Claude, Local LLM, etc.)  │
└─────────────────────────────────────┘
```

### Plugin System

```
┌─────────────────────────────────────┐
│         Plugin Manager              │
├─────────────────────────────────────┤
│  • Plugin discovery                 │
│  • Plugin installation              │
│  • Lifecycle management             │
│  • API exposure                     │
└───────────┬─────────────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌────▼────┐
│Theme   │    │Language │
│Plugins │    │Plugins  │
└────────┘    └─────────┘
```

---

<div align="center">

**بنية معمارية قابلة للتوسع والصيانة** 🏗️

Built with ❤️ for HarmonyOS

</div>

</div>
