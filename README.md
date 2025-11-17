# HarmonyOS Code Editor

محرر أكواد برمجية متكامل وحديث لنظام HarmonyOS، مشابه لـ VS Code من حيث المميزات والقدرات.

## 🎯 نظرة عامة

HarmonyOS Code Editor هو محرر نصوص قوي ومتطور مصمم خصيصاً لنظام HarmonyOS باستخدام ArkTS. يوفر المحرر تجربة تطوير متكاملة مع دعم كامل للإضافات القابلة للتوسع.

## ✨ المميزات

### المحرر الأساسي
- ✅ Syntax highlighting متقدم للعديد من اللغات
- ✅ Auto-completion ذكي
- ✅ Multiple cursors
- ✅ Find & Replace
- ✅ Line numbers و minimap
- ✅ Code folding
- ✅ دعم RTL/LTR

### إدارة الملفات
- ✅ File explorer متكامل
- ✅ دعم Workspace متعدد
- ✅ Recent files و projects
- ✅ Quick open

### الواجهة
- ✅ Light/Dark themes
- ✅ Customizable UI
- ✅ Tab-based multi-file editing
- ✅ Split view support

### نظام الإضافات
- 🚧 Extension API
- 🚧 Extension marketplace
- 🚧 Custom commands
- 🚧 Language support plugins

## 🏗️ البنية المعمارية

```
src/
├── core/                    # Core editor logic
│   ├── editor/             # Editor engine
│   │   ├── types.ts        # Type definitions
│   │   ├── TextBuffer.ts   # Text management
│   │   ├── EditorModel.ts  # Editor state
│   │   └── EditorController.ts
│   ├── language/           # Language services
│   │   ├── types.ts
│   │   ├── LanguageProvider.ts
│   │   ├── LanguageRegistry.ts
│   │   └── languages/      # Language implementations
│   └── filesystem/         # File operations
│       ├── types.ts
│       ├── FileSystemProvider.ts
│       └── WorkspaceService.ts
├── extensions/             # Extension system
│   ├── api/               # Extension API
│   ├── host/              # Extension host
│   └── marketplace/       # Extension store
├── ui/                     # UI Components
│   ├── components/        # Reusable components
│   │   ├── EditorView.ets
│   │   ├── FileExplorer.ets
│   │   ├── TabBar.ets
│   │   └── StatusBar.ets
│   ├── views/             # Main views
│   │   └── MainView.ets
│   └── themes/            # Theme system
│       ├── lightTheme.ts
│       ├── darkTheme.ts
│       └── ThemeRegistry.ts
├── services/              # Business logic
└── utils/                 # Utilities
```

## 🚀 البدء السريع

### المتطلبات
- DevEco Studio 4.0+
- HarmonyOS SDK 9+
- Node.js 16+

### التثبيت

```bash
# Clone the repository
git clone https://github.com/NESSER-IQ/DEVStudio.git
cd DEVStudio

# Install dependencies
npm install

# Build the project
npm run build
```

### التشغيل

1. افتح المشروع في DevEco Studio
2. قم بتوصيل جهاز HarmonyOS أو استخدم المحاكي
3. اضغط Run أو استخدم `npm run dev`

## 📚 التوثيق

للمزيد من المعلومات، راجع:
- [معمارية المشروع](docs/ARCHITECTURE.md)
- [دليل API](docs/API.md)
- [دليل المساهمة](docs/CONTRIBUTING.md)
- [Extension Development](docs/EXTENSION_API.md)

## 🎨 اللغات المدعومة

- JavaScript / JSX
- TypeScript / TSX / ArkTS
- Python
- Java
- C++
- HTML / CSS
- JSON
- XML
- Markdown

## 🔧 التطوير

### إضافة لغة برمجة جديدة

```typescript
import { LanguageProvider, LanguageConfiguration } from '@core/language';

const myLanguageConfig: LanguageConfiguration = {
  id: 'mylang',
  name: 'My Language',
  extensions: ['.ml'],
  syntaxRules: [
    // Define syntax rules
  ]
};

const provider = new LanguageProvider(myLanguageConfig);
languageRegistry.registerLanguage(provider);
```

### إنشاء Theme جديد

```typescript
import { Theme } from '@ui/themes';

const myTheme: Theme = {
  id: 'mytheme',
  name: 'My Theme',
  type: 'dark',
  colors: {
    // Define colors
  }
};

themeRegistry.registerTheme(myTheme);
```

## 🧪 الاختبارات

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 👥 المساهمون

نرحب بالمساهمات! راجع [دليل المساهمة](docs/CONTRIBUTING.md) للبدء.

## 🙏 شكر وتقدير

مستوحى من VS Code وغيره من المحررات المفتوحة المصدر.

## 📞 التواصل

- GitHub Issues: [Report bugs](https://github.com/NESSER-IQ/DEVStudio/issues)
- Email: support@example.com

---

**ملاحظة:** هذا المشروع في مرحلة التطوير النشطة. بعض المميزات قد لا تكون مكتملة بعد.
