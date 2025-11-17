# المساهمة في ArkStudio 🤝

<div dir="rtl">

شكراً لاهتمامك بالمساهمة في **ArkStudio**! نرحب بجميع أنواع المساهمات من المجتمع.

## 📋 جدول المحتويات

1. [كيف يمكنني المساهمة؟](#كيف-يمكنني-المساهمة)
2. [الإبلاغ عن الأخطاء](#الإبلاغ-عن-الأخطاء)
3. [اقتراح ميزات جديدة](#اقتراح-ميزات-جديدة)
4. [إرسال Pull Request](#إرسال-pull-request)
5. [معايير الكود](#معايير-الكود)
6. [هيكل الفروع](#هيكل-الفروع)

---

## كيف يمكنني المساهمة؟

هناك عدة طرق للمساهمة في ArkStudio:

- 🐛 **الإبلاغ عن الأخطاء**: ساعدنا في تحسين التطبيق بالإبلاغ عن المشاكل
- ✨ **اقتراح ميزات**: شارك أفكارك لميزات جديدة
- 💻 **كتابة الكود**: ساهم بإصلاحات أو ميزات جديدة
- 📝 **تحسين التوثيق**: ساعد في تحسين الشرح والأمثلة
- 🌍 **الترجمة**: ساعد في ترجمة التطبيق للغات أخرى

---

## الإبلاغ عن الأخطاء

### قبل الإبلاغ

- تأكد من استخدام أحدث إصدار من ArkStudio
- ابحث في [Issues](https://github.com/your-username/ArkStudio/issues) للتأكد من عدم الإبلاغ عن نفس المشكلة

### كيفية الإبلاغ

افتح [Issue جديد](https://github.com/your-username/ArkStudio/issues/new) وقدم:

1. **وصف المشكلة**: اشرح المشكلة بوضوح
2. **خطوات إعادة الإنتاج**: كيف يمكن إعادة إنتاج المشكلة؟
3. **السلوك المتوقع**: ماذا كنت تتوقع أن يحدث؟
4. **السلوك الفعلي**: ماذا حدث فعلياً؟
5. **البيئة**:
   - إصدار ArkStudio
   - إصدار HarmonyOS
   - نوع الجهاز
6. **لقطات الشاشة**: إن وُجدت
7. **السجلات**: أي رسائل خطأ أو logs

---

## اقتراح ميزات جديدة

نحب سماع أفكارك! لاقتراح ميزة جديدة:

1. افتح [Issue جديد](https://github.com/your-username/ArkStudio/issues/new)
2. استخدم عنوان واضح مثل: `[اقتراح] إضافة دعم لـ...`
3. اشرح:
   - **ما الميزة؟**: وصف مفصل للميزة المقترحة
   - **لماذا؟**: ما الفائدة؟ ما المشكلة التي تحلها؟
   - **كيف؟**: إذا كان لديك فكرة عن التنفيذ

---

## إرسال Pull Request

### الخطوات

1. **Fork المشروع**
   ```bash
   # اضغط على زر Fork في GitHub
   ```

2. **استنسخ Fork الخاص بك**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ArkStudio.git
   cd ArkStudio
   ```

3. **أنشئ فرع جديد**
   ```bash
   git checkout -b feature/amazing-feature
   # أو
   git checkout -b fix/bug-description
   ```

4. **قم بالتعديلات**
   - اكتب كود نظيف ومنظم
   - اتبع [معايير الكود](#معايير-الكود)
   - أضف تعليقات توضيحية
   - اختبر التعديلات

5. **Commit التغييرات**
   ```bash
   git add .
   git commit -m "وصف واضح للتغيير"
   ```

6. **Push إلى Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **افتح Pull Request**
   - اذهب إلى صفحة Fork الخاص بك
   - اضغط على "New Pull Request"
   - قدم وصفاً واضحاً للتغييرات

### متطلبات Pull Request

- ✅ كود نظيف ومنظم
- ✅ اتباع معايير الكود
- ✅ إضافة تعليقات توضيحية
- ✅ لا توجد أخطاء بناء (Build Errors)
- ✅ وصف واضح للتغييرات
- ✅ إشارة إلى Issue المرتبط (إن وُجد)

---

## معايير الكود

### ArkTS/TypeScript

```typescript
// ✅ جيد
export class FileSystemService {
  private workingDirectory: string = '';

  /**
   * قراءة محتوى ملف
   * @param filePath مسار الملف
   * @returns محتوى الملف
   */
  async readFile(filePath: string): Promise<string> {
    try {
      // الكود هنا
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return '';
    }
  }
}

// ❌ سيء
export class fileSystemService {
  var workingDirectory = '';

  readFile(filePath) {
    // بدون try-catch
    return content;
  }
}
```

### التسميات

- **Classes**: `PascalCase` (مثل: `FileSystemService`)
- **Functions/Methods**: `camelCase` (مثل: `readFile`)
- **Constants**: `UPPER_SNAKE_CASE` (مثل: `MAX_FILE_SIZE`)
- **Private Members**: تبدأ بـ `_` أو `private` (مثل: `private _cache`)

### التعليقات

- استخدم تعليقات JSDoc للوظائف العامة
- اكتب تعليقات توضيحية للأجزاء المعقدة
- استخدم العربية أو الإنجليزية بشكل متسق

```typescript
/**
 * دالة لحساب حجم المجلد
 * @param dirPath مسار المجلد
 * @returns حجم المجلد بالبايت
 */
async calculateDirectorySize(dirPath: string): Promise<number> {
  // تنفيذ الدالة
}
```

---

## هيكل الفروع

- `main` - الفرع الرئيسي (مستقر)
- `develop` - فرع التطوير
- `feature/*` - ميزات جديدة
- `fix/*` - إصلاح أخطاء
- `docs/*` - تحديثات التوثيق
- `refactor/*` - إعادة هيكلة الكود

### أمثلة

```bash
git checkout -b feature/monaco-themes      # ميزة جديدة
git checkout -b fix/file-explorer-crash    # إصلاح خطأ
git checkout -b docs/update-readme         # تحديث توثيق
git checkout -b refactor/lsp-client        # إعادة هيكلة
```

---

## رسائل Commit

استخدم رسائل واضحة ووصفية:

```bash
# ✅ جيد
git commit -m "إضافة دعم Git Merge في GitService"
git commit -m "إصلاح تعطل FileExplorer عند فتح مجلدات كبيرة"
git commit -m "تحسين أداء Monaco Editor عند فتح ملفات ضخمة"

# ❌ سيء
git commit -m "تحديث"
git commit -m "fix"
git commit -m "changes"
```

### نمط Conventional Commits (اختياري)

```bash
feat: إضافة ميزة جديدة
fix: إصلاح خطأ
docs: تحديث التوثيق
style: تنسيق الكود
refactor: إعادة هيكلة
test: إضافة اختبارات
chore: مهام صيانة
```

---

## العملية

### 1. قبول Pull Request

عند إرسال PR، سيتم:

1. ✅ مراجعة الكود
2. ✅ اختبار التغييرات
3. ✅ التحقق من معايير الكود
4. ✅ طلب تعديلات إن لزم
5. ✅ دمج PR في الفرع المناسب

### 2. المراجعة

- قد نطلب منك إجراء تعديلات
- الرجاء الرد على التعليقات
- حافظ على احترافية النقاش

### 3. الدمج

بعد الموافقة:

- سيتم دمج PR
- سيتم إغلاق Issue المرتبط
- سيتم إضافتك إلى قائمة المساهمين!

---

## الأسئلة؟

إذا كان لديك أي أسئلة:

- افتح [Discussion](https://github.com/your-username/ArkStudio/discussions)
- اسأل في [Issues](https://github.com/your-username/ArkStudio/issues)

---

## شكراً!

شكراً لك على المساهمة في **ArkStudio**! كل مساهمة، مهما كانت صغيرة، تساعد في تحسين المشروع.

<div align="center">

**معاً نبني أفضل IDE لـ HarmonyOS** 🚀

</div>

</div>
