# 🚀 دليل البدء السريع - ArkStudio

<div dir="rtl">

## مرحباً بك في ArkStudio!

هذا دليل سريع لمساعدتك على البدء في استخدام ArkStudio - أول IDE أصلي لنظام HarmonyOS.

---

## 📦 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- ✅ **DevEco Studio** 5.1.0 أو أحدث
- ✅ **HarmonyOS SDK** 5.1.0(18) أو أحدث
- ✅ **Node.js** (اختياري، للتطوير)
- ✅ اتصال بالإنترنت (لتحميل Monaco Editor من CDN)

---

## ⚡ البدء في 5 دقائق

### 1️⃣ استنساخ المشروع

```bash
git clone https://github.com/NESSER-IQ/DEVStudio.git
cd DEVStudio
```

### 2️⃣ فتح المشروع

1. افتح **DevEco Studio**
2. اختر: `File` → `Open`
3. حدد مجلد `DEVStudio`
4. انتظر حتى يتم تحميل المشروع

### 3️⃣ تثبيت التبعيات (اختياري)

```bash
# في terminal DevEco Studio
ohpm install
```

### 4️⃣ تشغيل التطبيق

#### على المحاكي:
1. افتح Device Manager في DevEco Studio
2. أنشئ محاكي HarmonyOS (Phone أو Tablet)
3. اضغط على زر **Run** (▶️)

#### على جهاز حقيقي:
1. فعّل وضع المطور على جهازك
2. وصّل الجهاز بالكمبيوتر
3. اضغط على زر **Run** (▶️)

### 5️⃣ استكشف التطبيق!

عند تشغيل التطبيق لأول مرة، ستشاهد:

```
┌──────────────────────────────────┐
│  ⚡ ArkStudio    📂 💻 ⋯         │  ← Top Bar
├──┬──────────┬──────────────────┤
│  │          │                  │
│📁│ Files    │  // Welcome to   │
│🔍│          │  // ArkStudio    │
│🌿│          │                  │
│🧩│          │                  │
│⚙️│          │                  │
│  │          │                  │
└──┴──────────┴──────────────────┘
```

---

## 🎯 الميزات الأساسية

### 1. محرر الأكواد

- افتح ملفاً من File Explorer
- اكتب كود ArkTS/TypeScript/JavaScript
- استمتع بـ:
  - ✨ تلوين الأكواد
  - ✨ الإكمال التلقائي
  - ✨ اكتشاف الأخطاء

### 2. مستكشف الملفات

- اضغط على 📁 لفتح File Explorer
- تصفح الملفات والمجلدات
- اضغط على أي ملف لفتحه في المحرر

### 3. الإعدادات

- اضغط على ⚙️ لفتح Settings
- عدّل:
  - حجم الخط
  - حجم Tab
  - السمة (Theme)
  - خيارات LSP و Git

### 4. الطرفية (Terminal)

- اضغط على 💻 لفتح Bottom Panel
- استخدم الطرفية لتنفيذ الأوامر
- شاهد المخرجات (Output) والمشاكل (Problems)

---

## 🔧 التخصيص

### تغيير السمة (Theme)

```typescript
// في resources/rawfile/monaco/index.html
monaco.editor.setTheme('vs-dark');  // Dark (الافتراضي)
// أو
monaco.editor.setTheme('vs-light'); // Light
// أو
monaco.editor.setTheme('hc-black'); // High Contrast
```

### تعديل الألوان

قم بتعديل `entry/src/main/resources/base/element/color.json`:

```json
{
  "color": [
    {
      "name": "accent",
      "value": "#007ACC"  // غيّر هذا اللون
    }
  ]
}
```

### إضافة لغة برمجة جديدة (عبر LSP)

```typescript
import { lspClient } from '../services/LSPClient';

// مثال: إضافة دعم Python
lspClient.registerLanguageServer({
  languageId: 'python',
  command: 'pylsp',
  args: ['--tcp', '--port', '2087']
});

await lspClient.startLanguageServer('python');
```

---

## 📚 الموارد

### الوثائق الرسمية

- 📖 [README.md](./README.md) - نظرة عامة شاملة
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - البنية المعمارية
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - دليل المساهمة

### أدلة إضافية

- [HarmonyOS Docs](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/)
- [ArkTS Language](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/arkts-get-started-V5)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Monaco Editor لا يحمّل

**السبب**: عدم الاتصال بالإنترنت أو حظر CDN

**الحل**:
```typescript
// استخدم نسخة محلية من Monaco
// قم بتحميل Monaco وضعه في resources/rawfile/monaco/lib/
// ثم غيّر في index.html:
require.config({
  paths: { 'vs': './lib/vs' }  // بدلاً من CDN
});
```

### المشكلة: File Explorer فارغ

**السبب**: الصلاحيات أو المسار غير صحيح

**الحل**:
```typescript
// تحقق من صلاحيات الوصول للملفات في module.json5
"requestPermissions": [
  {
    "name": "ohos.permission.FILE_ACCESS_MANAGER"
  }
]
```

### المشكلة: Git لا يعمل

**السبب**: Git غير مثبت أو Process API محظور

**الحل**:
- تأكد من تثبيت Git على الجهاز
- تحقق من صلاحيات Process في module.json5

---

## 💡 نصائح للمطورين

### 1. التطوير السريع

```bash
# استخدم Hot Reload
hvigorw --mode module -p module=entry@default -p product=default assembleHap
```

### 2. Debugging

```typescript
// استخدم hilog للسجلات
import { hilog } from '@kit.PerformanceAnalysisKit';

hilog.info(0x0000, 'ArkStudio', 'Debug message: %{public}s', value);
```

### 3. Build Optimization

```typescript
// في build-profile.json5
"arkOptions": {
  "obfuscation": {
    "ruleOptions": {
      "enable": true  // للإصدار النهائي فقط
    }
  }
}
```

---

## 🎓 أمثلة عملية

### مثال 1: فتح مشروع HarmonyOS

1. افتح File Explorer
2. انتقل إلى `/data/storage/el2/base/haps/entry/files/`
3. اختر مجلد مشروعك
4. ابدأ في التطوير!

### مثال 2: استخدام Git

1. افتح Terminal من Bottom Panel
2. نفّذ:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <url>
   git push -u origin main
   ```

### مثال 3: كتابة كود ArkUI

```typescript
@Entry
@Component
struct HelloWorld {
  @State message: string = 'Hello, HarmonyOS!';

  build() {
    Column() {
      Text(this.message)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

---

## 🚀 الخطوات التالية

الآن بعد أن جربت ArkStudio، يمكنك:

1. ✅ قراءة [ARCHITECTURE.md](./ARCHITECTURE.md) لفهم البنية
2. ✅ المساهمة في المشروع عبر [CONTRIBUTING.md](./CONTRIBUTING.md)
3. ✅ اقتراح ميزات جديدة في [GitHub Issues](https://github.com/NESSER-IQ/DEVStudio/issues)
4. ✅ مشاركة تجربتك مع المجتمع

---

## 📞 الدعم والمساعدة

هل تحتاج مساعدة؟

- 💬 [GitHub Discussions](https://github.com/NESSER-IQ/DEVStudio/discussions)
- 🐛 [Report a Bug](https://github.com/NESSER-IQ/DEVStudio/issues/new)
- 📧 Email: support@arkstudio.dev (قريباً)

---

## 🎉 شكراً لاستخدامك ArkStudio!

نأمل أن تستمتع بتجربة التطوير على HarmonyOS مع ArkStudio.

<div align="center">

**صُنع بـ ❤️ لمجتمع HarmonyOS**

⚡ **Happy Coding!** ⚡

[⭐ Star on GitHub](https://github.com/NESSER-IQ/DEVStudio) | [🐛 Report Bug](https://github.com/NESSER-IQ/DEVStudio/issues) | [💡 Request Feature](https://github.com/NESSER-IQ/DEVStudio/issues/new)

</div>

</div>
