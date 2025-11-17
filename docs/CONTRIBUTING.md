# دليل المساهمة

شكراً لاهتمامك بالمساهمة في HarmonyOS Code Editor! نرحب بجميع أنواع المساهمات.

## كيفية المساهمة

### 1. الإبلاغ عن المشاكل (Issues)

إذا وجدت خطأ أو لديك اقتراح:

1. تحقق من [Issues](https://github.com/NESSER-IQ/DEVStudio/issues) الموجودة
2. إذا لم تجد issue مشابه، قم بإنشاء واحد جديد
3. اكتب وصفاً واضحاً ومفصلاً
4. أضف خطوات إعادة إنتاج المشكلة إذا كان ذلك ممكناً

### 2. اقتراح ميزة جديدة

1. افتح issue جديد مع تسمية "Feature Request"
2. اشرح الميزة المقترحة والفائدة منها
3. أضف أمثلة للاستخدام إذا أمكن

### 3. المساهمة بالكود

#### Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/DEVStudio.git
cd DEVStudio

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/my-new-feature
```

#### Coding Standards

##### TypeScript/ArkTS
- استخدم TypeScript strict mode
- اتبع naming conventions:
  - Classes: `PascalCase`
  - Functions/Methods: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Interfaces: `PascalCase` مع بادئة `I` للواجهات الرئيسية
- أضف JSDoc comments للوظائف العامة

```typescript
/**
 * Inserts text at a specific position
 * @param position - The position to insert at
 * @param text - The text to insert
 * @returns The change event
 */
insertText(position: Position, text: string): TextChange {
  // Implementation
}
```

##### ArkTS Components
- استخدم decorators بشكل صحيح (@Component, @State, etc.)
- افصل المنطق عن UI
- استخدم @Builder للمكونات المتكررة

```typescript
@Component
export struct MyComponent {
  @State private data: string = '';

  @Builder
  buildItem(text: string) {
    Text(text)
  }

  build() {
    Column() {
      this.buildItem(this.data)
    }
  }
}
```

#### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- TextBuffer.test.ts
```

تأكد من:
- كتابة اختبارات للكود الجديد
- جميع الاختبارات تنجح
- Coverage لا يقل عن 70%

#### Commit Messages

استخدم conventional commits:

```
type(scope): subject

body

footer
```

الأنواع المسموحة:
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تغييرات التوثيق
- `style`: تنسيق الكود
- `refactor`: إعادة هيكلة
- `test`: إضافة اختبارات
- `chore`: مهام صيانة

أمثلة:
```
feat(editor): add multiple cursor support

Implemented multiple cursor functionality allowing users to edit
multiple locations simultaneously.

Closes #123
```

```
fix(filesystem): handle permission errors correctly

Fixed crash when accessing files without read permissions.

Fixes #456
```

#### Pull Request

1. تأكد من أن الكود يتبع المعايير
2. قم بتحديث التوثيق إذا لزم الأمر
3. أضف اختبارات للميزات الجديدة
4. اكتب وصفاً واضحاً للـ PR
5. اربط الـ PR بـ issue ذي صلة

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Changes
- Added feature X
- Fixed bug Y

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(if applicable)
```

### 4. مراجعة الكود

سيتم مراجعة الـ PR من قبل المشرفين:
- قد يُطلب منك إجراء تعديلات
- كن منفتحاً للتعليقات البناءة
- استجب للتعليقات في الوقت المناسب

### 5. المساهمة بالتوثيق

التوثيق مهم جداً!

- حدّث README.md عند إضافة ميزات
- أضف أمثلة للاستخدام
- وثّق الـ API الجديدة في docs/API.md
- اكتب بوضوح وبشكل مفصل

## معايير الجودة

### Code Quality
- اتبع SOLID principles
- اكتب كود نظيف وقابل للقراءة
- تجنب التكرار (DRY)
- استخدم meaningful names

### Performance
- تجنب العمليات المكلفة في render loop
- استخدم lazy loading عند الإمكان
- راعِ استهلاك الذاكرة

### Security
- لا تستخدم eval() أو similar unsafe functions
- تحقق من المدخلات
- تجنب XSS وغيرها من الثغرات

### Accessibility
- استخدم semantic HTML/components
- وفر keyboard navigation
- اختبر مع screen readers

## الحصول على المساعدة

- اطرح أسئلتك في [Discussions](https://github.com/NESSER-IQ/DEVStudio/discussions)
- انضم إلى [Discord/Slack] (إذا متوفر)
- راجع التوثيق في مجلد `docs/`

## Code of Conduct

نتوقع من جميع المساهمين:
- الاحترام والأدب
- التعاون البناء
- قبول النقد البناء
- التركيز على ما هو أفضل للمجتمع

## License

بالمساهمة في هذا المشروع، فإنك توافق على أن مساهماتك ستكون مرخصة بموجب MIT License.

---

شكراً لك على المساهمة في جعل HarmonyOS Code Editor أفضل! 🎉
