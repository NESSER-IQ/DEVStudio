# ArkStudio ⚡

<div dir="rtl">

## بيئة تطوير متكاملة أصيلة لنظام هارموني

**ArkStudio** هو أول IDE (بيئة تطوير متكاملة) أصلي بالكامل لنظام التشغيل **HarmonyOS**، مبني بالكامل باستخدام **ArkTS** و **ArkUI**.

### ✨ المميزات الرئيسية

#### 🎯 الإصدار الأول (MVP - v1.0)

- ✅ **محرر Monaco**: محرر أكواد قوي يعتمد على نواة VS Code
- ✅ **مستكشف ملفات**: واجهة شجرية لتصفح الملفات والمجلدات
- ✅ **بنية LSP**: دعم Language Server Protocol لإضافة لغات برمجة جديدة
- ✅ **تكامل Git**: عمليات Git الأساسية (Clone, Commit, Push, Pull)
- ✅ **واجهة تكيفية**: تعمل بسلاسة على الهواتف والأجهزة اللوحية
- ✅ **طرفية مدمجة**: تنفيذ الأوامر داخل التطبيق

#### 🚀 المميزات المستقبلية (v2.0+)

- 🔄 **الوضع الموزع**: مشاركة اللوحات بين الأجهزة المختلفة
- 🤖 **Ark Copilot**: مساعد ذكاء اصطناعي مدرك لـ HarmonyOS
- 🌍 **دعم لغات متعددة**: عبر إضافة Language Servers
- 🔌 **نظام الإضافات**: إمكانية تثبيت ملحقات خارجية

---

## 📁 بنية المشروع

```
ArkStudio/
├── entry/                          # وحدة التطبيق الرئيسية
│   ├── src/main/
│   │   ├── ets/
│   │   │   ├── entryability/      # نقطة الدخول
│   │   │   │   └── EntryAbility.ets
│   │   │   ├── pages/             # الصفحات
│   │   │   │   ├── Index.ets      # الصفحة الرئيسية
│   │   │   │   ├── EditorPage.ets
│   │   │   │   └── SettingsPage.ets
│   │   │   ├── components/        # المكونات
│   │   │   │   ├── MonacoEditor.ets    # محرر الأكواد
│   │   │   │   ├── FileExplorer.ets    # مستكشف الملفات
│   │   │   │   ├── Sidebar.ets         # الشريط الجانبي
│   │   │   │   ├── Topbar.ets          # الشريط العلوي
│   │   │   │   └── BottomPanel.ets     # اللوحة السفلية
│   │   │   ├── services/          # الخدمات
│   │   │   │   ├── FileSystemService.ets
│   │   │   │   ├── LSPClient.ets
│   │   │   │   └── GitService.ets
│   │   │   ├── models/            # نماذج البيانات
│   │   │   │   └── FileNode.ets
│   │   │   └── utils/             # أدوات مساعدة
│   │   └── resources/
│   │       ├── base/
│   │       │   ├── element/       # النصوص والألوان
│   │       │   ├── media/         # الصور والأيقونات
│   │       │   └── profile/       # ملفات التكوين
│   │       └── rawfile/
│   │           └── monaco/        # محرر Monaco
│   │               └── index.html
│   └── build-profile.json5
├── build-profile.json5
├── oh-package.json5
└── README.md
```

---

## 🏗️ البنية المعمارية

### 1️⃣ محرر الأكواد (Monaco Editor)

- **التقنية**: Monaco Editor (نواة VS Code) عبر WebView
- **المميزات**:
  - تلوين الأكواد (Syntax Highlighting)
  - الإكمال التلقائي (Auto-completion)
  - اكتشاف الأخطاء (Error Detection)
  - دعم متعدد اللغات

### 2️⃣ دعم اللغات (LSP Client)

- **التقنية**: Language Server Protocol
- **الفائدة**: إضافة دعم لغات جديدة بسهولة دون إعادة برمجة المحرر
- **اللغات المدعومة في MVP**:
  - TypeScript / ArkTS
  - JavaScript
- **مستقبلاً**: Python, C++, Dart, Go, Rust, وغيرها

### 3️⃣ نظام الملفات

- **التقنية**: FileIO API من HarmonyOS
- **المميزات**:
  - قراءة وكتابة الملفات
  - إنشاء وحذف الملفات/المجلدات
  - عرض شجري للملفات

### 4️⃣ تكامل Git

- **التقنية**: تنفيذ أوامر Git عبر Process API
- **العمليات المدعومة**:
  - Init, Clone
  - Add, Commit
  - Push, Pull, Fetch
  - Branch, Checkout
  - Status, Diff, Log

---

## 🎨 تصميم الواجهة

### الواجهة التكيفية (Adaptive Layout)

التطبيق مصمم للعمل على مختلف الأجهزة:

#### 📱 الهواتف (Compact)
- واجهة مركزة على المحرر
- قوائم جانبية قابلة للسحب
- لوحة سفلية قابلة للإخفاء

#### 📱 الأجهزة اللوحية (Medium/Large)
- عرض متعدد الألواح
- مستكشف ملفات + محرر + طرفية
- تجربة مشابهة لـ VS Code على سطح المكتب

#### 🔄 الوضع الموزع (Distributed) - قريباً
- إرسال لوحات معينة إلى أجهزة أخرى
- مزامنة العمل عبر الأجهزة المختلفة

### نظام الألوان

التطبيق يستخدم **Dark Theme** المستوحى من VS Code:

- `#1E1E1E` - الخلفية الرئيسية
- `#252526` - الخلفية الثانوية
- `#007ACC` - اللون المميز (Accent)
- `#D4D4D4` - النص الرئيسي
- `#858585` - النص الثانوي

---

## 🚀 البدء في التطوير

### المتطلبات

- **DevEco Studio** 5.1.0 أو أحدث
- **HarmonyOS SDK** 5.1.0(18) أو أحدث
- **Node.js** (للتطوير)

### خطوات التشغيل

1. **استنساخ المشروع**:
   ```bash
   git clone https://github.com/your-username/ArkStudio.git
   cd ArkStudio
   ```

2. **فتح المشروع في DevEco Studio**:
   - File → Open → اختر مجلد ArkStudio

3. **تثبيت التبعيات**:
   ```bash
   ohpm install
   ```

4. **تشغيل التطبيق**:
   - اضغط على زر Run
   - اختر جهاز المحاكي أو جهاز حقيقي

---

## 📦 البناء والنشر

### بناء Debug:
```bash
hvigorw assembleDebug
```

### بناء Release:
```bash
hvigorw assembleRelease
```

الملف الناتج: `entry/build/outputs/default/entry-default-signed.hap`

---

## 🔧 التكوين المتقدم

### إضافة Language Server جديد

```typescript
import { lspClient } from '../services/LSPClient';

// تسجيل خادم لغة Python
lspClient.registerLanguageServer({
  languageId: 'python',
  command: 'python-language-server',
  args: ['--stdio']
});

// بدء الخادم
await lspClient.startLanguageServer('python');
```

### تخصيص المحرر

قم بتعديل `resources/rawfile/monaco/index.html`:

```javascript
editor = monaco.editor.create(document.getElementById('container'), {
  theme: 'vs-dark',        // أو 'vs-light' أو 'hc-black'
  fontSize: 14,
  tabSize: 2,
  // المزيد من الخيارات...
});
```

---

## 🤝 المساهمة

نرحب بجميع المساهمات! إذا كنت ترغب في المساعدة:

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بالتعديلات
4. Commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
5. Push إلى الفرع (`git push origin feature/amazing-feature`)
6. افتح Pull Request

---

## 🗺️ خريطة الطريق

### v1.0 (MVP) ✅ - الحالي
- [x] محرر Monaco
- [x] مستكشف ملفات
- [x] بنية LSP
- [x] تكامل Git الأساسي

### v1.1 - قريباً
- [ ] تحسين الطرفية المدمجة
- [ ] دعم السمات (Themes)
- [ ] البحث والاستبدال المتقدم
- [ ] دعم Git الكامل (Merge, Rebase, Conflicts)

### v2.0 - المستقبل
- [ ] Ark Copilot (مساعد AI)
- [ ] الوضع الموزع
- [ ] نظام الإضافات
- [ ] دعم Debugging

---

## 📝 الترخيص

هذا المشروع مرخص تحت **MIT License** - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🙏 شكر وتقدير

- **Monaco Editor** - Microsoft
- **HarmonyOS** - Huawei
- **Language Server Protocol** - Microsoft
- جميع المساهمين في المشروع

---

## 📞 التواصل

- **GitHub**: [ArkStudio Repository](https://github.com/your-username/ArkStudio)
- **Issues**: [تقرير مشكلة](https://github.com/your-username/ArkStudio/issues)
- **Discussions**: [المناقشات](https://github.com/your-username/ArkStudio/discussions)

---

<div align="center">

**صُنع بـ ❤️ لمجتمع HarmonyOS**

⚡ **ArkStudio** - أول IDE أصلي لنظام HarmonyOS ⚡

</div>

</div>
