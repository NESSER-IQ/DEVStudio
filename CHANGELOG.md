# سجل التغييرات - ArkStudio

<div dir="rtl">

جميع التغييرات المهمة في هذا المشروع سيتم توثيقها في هذا الملف.

النسق المتّبع مبني على [Keep a Changelog](https://keepachangelog.com/ar/1.0.0/)،
وهذا المشروع يلتزم بـ [Semantic Versioning](https://semver.org/lang/ar/).

---

## [1.0.0] - 2024-11-17

### 🎉 الإصدار الأول (MVP)

أول إصدار رسمي من ArkStudio - بيئة التطوير المتكاملة الأصلية لنظام HarmonyOS!

#### ✨ إضافات (Added)

##### المحرر (Editor)
- دمج محرر Monaco Editor (نواة VS Code) عبر WebView
- دعم تلوين الأكواد (Syntax Highlighting) لـ:
  - TypeScript / ArkTS
  - JavaScript
  - JSON / JSON5
  - HTML / CSS
  - Markdown
  - Python, Java, C++, Rust, Go
- الإكمال التلقائي (Auto-completion) للغات المدعومة
- اكتشاف الأخطاء (Error Detection) في الوقت الفعلي
- البحث والاستبدال (Find & Replace)
- تنسيق الكود (Code Formatting)
- دعم Font Ligatures
- Minimap للملفات الكبيرة

##### مستكشف الملفات (File Explorer)
- عرض شجري للملفات والمجلدات
- فتح وإغلاق المجلدات
- أيقونات مميزة لأنواع الملفات المختلفة
- فتح الملفات في المحرر بنقرة واحدة
- دعم التمرير السلس (Smooth Scrolling)

##### نظام الملفات (File System)
- قراءة الملفات والمجلدات
- كتابة وتعديل الملفات
- إنشاء ملفات ومجلدات جديدة
- حذف الملفات والمجلدات
- إعادة تسمية الملفات والمجلدات
- الحصول على معلومات الملفات (حجم، تاريخ التعديل)

##### تكامل Git
- **الأوامر الأساسية**:
  - `git init` - إنشاء مستودع جديد
  - `git clone` - استنساخ مستودع
  - `git add` - إضافة ملفات للـ staging
  - `git commit` - حفظ التغييرات
  - `git push` - رفع التغييرات للـ remote
  - `git pull` - سحب التغييرات من الـ remote
  - `git fetch` - جلب التحديثات
- **إدارة الفروع (Branches)**:
  - عرض جميع الفروع
  - إنشاء فرع جديد
  - التبديل بين الفروع (checkout)
- **المعلومات**:
  - حالة المستودع (git status)
  - سجل الـ commits (git log)
  - الفروقات (git diff)

##### البنية التحتية لـ LSP
- بنية أساسية كاملة لـ Language Server Protocol
- دعم تسجيل Language Servers جديدة
- واجهات جاهزة لـ:
  - Completions (الإكمال التلقائي)
  - Diagnostics (اكتشاف الأخطاء)
  - Go to Definition (الانتقال للتعريف)
  - Find References (البحث عن المراجع)
  - Rename Symbol (إعادة تسمية الرموز)
  - Document Formatting (تنسيق المستند)
- جاهز لإضافة خوادم لغات جديدة مستقبلاً

##### الواجهة (UI/UX)
- **Topbar**: شريط علوي مع معلومات الملف الحالي
- **Sidebar**: قائمة جانبية بأيقونات للميزات:
  - 📁 Files (مستكشف الملفات)
  - 🔍 Search (البحث - قريباً)
  - 🌿 Git (إدارة Git - قريباً)
  - 🧩 Extensions (الإضافات - قريباً)
  - ⚙️ Settings (الإعدادات)
- **Bottom Panel**: لوحة سفلية قابلة للإخفاء:
  - 💻 Terminal (الطرفية)
  - 📋 Output (المخرجات)
  - ⚠️ Problems (المشاكل)
  - 🐛 Debug Console (وحدة التحكم في التصحيح)
- **تصميم تكيفي (Adaptive)**:
  - يعمل على الهواتف (Compact)
  - يعمل على الأجهزة اللوحية (Medium/Large)
  - تخطيط متعدد الألواح على الشاشات الكبيرة

##### الصفحات (Pages)
- **Index**: الصفحة الرئيسية مع التخطيط الكامل للـ IDE
- **EditorPage**: صفحة محرر منفصلة لوضع ملء الشاشة
- **SettingsPage**: صفحة الإعدادات مع خيارات التخصيص:
  - حجم الخط (Font Size)
  - حجم Tab (Tab Size)
  - السمة (Theme)
  - الحفظ التلقائي (Auto Save)
  - تفعيل/تعطيل LSP
  - تفعيل/تعطيل Git

##### الخدمات (Services)
- **FileSystemService**: خدمة نظام الملفات
- **LSPClient**: عميل Language Server Protocol
- **GitService**: خدمة تكامل Git

##### النماذج (Models)
- **FileNode**: نموذج بيانات للملفات والمجلدات

##### التوثيق
- 📖 **README.md**: دليل شامل بالعربية
- 🏗️ **ARCHITECTURE.md**: شرح البنية المعمارية
- 🤝 **CONTRIBUTING.md**: دليل المساهمة
- 🚀 **QUICKSTART.md**: دليل البدء السريع
- 📜 **LICENSE**: ترخيص MIT
- 📝 **CHANGELOG.md**: سجل التغييرات (هذا الملف)

#### 🎨 السمات والتصميم (Styling)
- سمة Dark Theme مستوحاة من VS Code
- نظام ألوان متسق:
  - `#1E1E1E` - الخلفية الرئيسية
  - `#252526` - الخلفية الثانوية
  - `#007ACC` - اللون المميز
  - `#D4D4D4` - النص الرئيسي
  - `#858585` - النص الثانوي

#### 🔧 التكوين والبناء
- ملفات تكوين HarmonyOS SDK 5.1.0
- دعم Build Debug و Release
- قواعد التشويش (Obfuscation Rules)
- `.gitignore` محدّث
- دعم Hvigor Build System

#### 📦 التبعيات
- HarmonyOS SDK 5.1.0(18)
- Monaco Editor (via CDN)
- لا توجد تبعيات خارجية أخرى (MVP)

---

## [1.1.0] - 2024-11-17

### ✨ الميزات الجديدة (Added)

#### 🎨 نظام السمات (Theme System)
- **ثلاثة سمات مدمجة**:
  - Dark Theme (VS Code Dark+) - السمة الافتراضية
  - Light Theme (VS Code Light+) - سمة فاتحة
  - High Contrast Theme - للوضوح العالي
- **Theme Service**: خدمة مركزية لإدارة السمات
- **Theme Models**: نماذج بيانات محددة للسمات
- **حفظ تلقائي**: تحفظ السمة المختارة تلقائياً
- **تطبيق فوري**: تتغير الواجهة فوراً عند اختيار سمة جديدة
- **تكامل Monaco**: تُطبّق السمة على محرر Monaco تلقائياً
- **واجهة اختيار**: حوار أنيق لاختيار السمة من الإعدادات

#### 💻 الطرفية المحسّنة (Enhanced Terminal)
- **سجل الأوامر (Command History)**:
  - حفظ آخر 100 أمر
  - التنقل باستخدام ↑/↓
  - إزالة التكرارات تلقائياً
- **اقتراحات الأوامر (Command Suggestions)**:
  - اقتراحات تلقائية أثناء الكتابة
  - دعم أوامر Git, npm, hvigorw
  - قابلة للنقر للاختيار السريع
- **تلوين المخرجات**:
  - ألوان مختلفة للأوامر والأخطاء والمعلومات
  - دعم أيقونات للأنواع المختلفة
  - خط monospace للوضوح
- **أوامر مدمجة جديدة**:
  - `help` - عرض الأوامر المتاحة
  - `clear` - مسح الشاشة
  - `history` - عرض سجل الأوامر
  - `ls`, `pwd` - محاكاة أوامر الملفات
- **تحسينات واجهة**:
  - زر مسح الشاشة
  - زر مسح النص المكتوب
  - رسالة ترحيب محسّنة

#### 🔍 البحث والاستبدال المتقدم (Search Panel)
- **البحث العالمي**: البحث في جميع ملفات المشروع
- **خيارات متقدمة**:
  - Case Sensitive (حساس لحالة الأحرف)
  - Whole Word (كلمة كاملة فقط)
  - Regular Expressions (تعبيرات نمطية)
- **عرض النتائج**: قائمة منظمة بالنتائج
- **البحث والاستبدال**: إمكانية الاستبدال الجماعي
- **معلومات تفصيلية**: عرض اسم الملف ورقم السطر

#### 🌿 لوحة Git (Git Panel)
- **ثلاثة أقسام**:
  - **Changes**: عرض التغييرات والملفات المعدّلة
  - **Branches**: إدارة الفروع والتبديل بينها
  - **History**: عرض سجل الـ commits
- **عرض الحالة**:
  - Staged changes (ملفات جاهزة للـ commit)
  - Unstaged changes (ملفات معدّلة غير مُضافة)
  - Untracked files (ملفات جديدة)
- **عمليات سريعة**:
  - Commit مباشر من اللوحة
  - Push بنقرة واحدة
  - Refresh لتحديث الحالة
- **إدارة الفروع**:
  - عرض جميع الفروع
  - تمييز الفرع الحالي
  - التبديل بين الفروع بنقرة
- **سجل Commits**:
  - عرض آخر 20 commit
  - معلومات المؤلف والتاريخ
  - Hash مختصر للـ commit

#### ⚙️ تحسينات Git (Git Enhancements)
- **Merge Operations**:
  - `merge(branch, strategy)` - دمج الفروع
  - `abortMerge()` - إلغاء عملية الدمج
  - دعم استراتيجيات ours/theirs
- **Rebase Operations**:
  - `rebase(branch)` - إعادة تأسيس على فرع
  - `rebaseContinue()` - متابعة بعد حل النزاعات
  - `rebaseAbort()` - إلغاء عملية Rebase
- **Cherry-pick**: نسخ commit محدد
- **Stash Operations**:
  - `stash(message)` - حفظ تغييرات مؤقتة
  - `stashPop()` - استرجاع التغييرات
  - `listStashes()` - عرض جميع الـ stashes

### 🔧 التحسينات (Changed)
- **صفحة الإعدادات**: واجهة محسّنة مع حوار اختيار السمات
- **رقم الإصدار**: تحديث إلى 1.1.0
- **Terminal Service**: خدمة منفصلة لإدارة الطرفية
- **أداء أفضل**: تحسينات في سرعة العرض والاستجابة

### 📝 الملفات الجديدة
- `models/Theme.ets` - نماذج السمات
- `services/ThemeService.ets` - خدمة إدارة السمات
- `services/TerminalService.ets` - خدمة الطرفية المحسّنة
- `components/SearchPanel.ets` - مكون البحث والاستبدال
- `components/GitPanel.ets` - لوحة Git

### 📊 الإحصائيات
- ✅ **8 ملفات جديدة**
- ✅ **3 ملفات محدّثة**
- ✅ **2000+ سطر برمجي إضافي**
- ✅ **15+ ميزة جديدة**

---

## [مستقبلي] - النسخة 2.0

### 🚀 ميزات كبرى مخططة

#### Ark Copilot (مساعد AI)
- [ ] الإكمال التلقائي الذكي بالـ AI
- [ ] شرح الأكواد
- [ ] تحويل الأكواد (Android → HarmonyOS)
- [ ] اكتشاف الأخطاء والحلول المقترحة
- [ ] توليد الأكواد من الوصف
- [ ] تحسين الأداء والـ refactoring

#### الوضع الموزع (Distributed Mode)
- [ ] مشاركة اللوحات بين الأجهزة
- [ ] المعاينة المباشرة على جهاز آخر
- [ ] مزامنة الكود عبر الأجهزة
- [ ] التعاون الجماعي (Multi-user)

#### نظام الإضافات (Plugin System)
- [ ] Plugin Manager
- [ ] Plugin API
- [ ] متجر الإضافات
- [ ] دعم السمات كإضافات
- [ ] دعم Language Servers كإضافات

#### دعم لغات إضافية
- [ ] Python Language Server
- [ ] C++ Language Server
- [ ] Dart/Flutter Language Server
- [ ] Rust Language Server
- [ ] Go Language Server

#### Debugging المتقدم
- [ ] Breakpoints
- [ ] Step-by-step Execution
- [ ] Variable Inspection
- [ ] Call Stack Viewer
- [ ] Remote Debugging

---

## نمط الإصدارات

نحن نتبع [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): تغييرات كبيرة قد تكسر التوافق
- **MINOR** (x.1.x): إضافة ميزات جديدة متوافقة
- **PATCH** (x.x.1): إصلاحات الأخطاء

---

## أنواع التغييرات

- **Added** (إضافة): ميزات جديدة
- **Changed** (تغيير): تغييرات في الميزات الموجودة
- **Deprecated** (مهمل): ميزات ستُزال قريباً
- **Removed** (إزالة): ميزات مُزالة
- **Fixed** (إصلاح): إصلاحات للأخطاء
- **Security** (أمان): إصلاحات أمنية

---

<div align="center">

**شكراً لاستخدامك ArkStudio!**

[⭐ Star on GitHub](https://github.com/NESSER-IQ/DEVStudio) | [🐛 Report Bug](https://github.com/NESSER-IQ/DEVStudio/issues)

</div>

</div>
