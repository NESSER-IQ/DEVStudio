# Markdown Language Support Extension

Enhanced Markdown language support with IntelliSense and preview capabilities.

## Features

### IntelliSense

Provides intelligent completions for Markdown syntax:

- **Headings**: `#`, `##`, `###`, etc.
- **Formatting**: Bold (`**text**`), Italic (`*text*`)
- **Links**: `[text](url)`
- **Code Blocks**: ` ```language ... ``` `
- **Lists**: `- item`, `1. item`
- **And more!**

### Commands

- **Markdown: Show Preview** - Opens a live preview of the Markdown file

## Usage

### Auto-Completion

Just start typing Markdown syntax and press `Ctrl+Space` to trigger completions:

1. Type `#` and select a heading level
2. Type `*` for bold or italic
3. Type `[` for a link
4. Type ` ``` ` for a code block

### Preview

1. Open a Markdown file (.md)
2. Press `Ctrl+Shift+P` to open command palette
3. Type "Markdown: Show Preview"
4. Press Enter

## Extension Structure

```
language-extension/
├── package.json       # Extension manifest
├── extension.ts       # Extension code
└── README.md         # This file
```

## Development

This extension demonstrates:

### 1. Language Registration

```json
{
  "contributes": {
    "languages": [
      {
        "id": "markdown",
        "extensions": [".md", ".markdown"]
      }
    ]
  }
}
```

### 2. Completion Provider

```typescript
languages.registerCompletionItemProvider('markdown', {
  provideCompletionItems(document, position) {
    return [
      {
        label: '# Heading',
        insertText: '# ${1:text}',
        kind: CompletionItemKind.Snippet
      }
    ];
  }
}, '#', '*');  // Trigger characters
```

### 3. Commands

```typescript
commands.registerCommand('markdown.showPreview', () => {
  // Preview implementation
});
```

## API Used

- `languages.registerCompletionItemProvider()` - Register completions
- `commands.registerCommand()` - Register commands
- `window.showInformationMessage()` - Show messages
- `window.createOutputChannel()` - Create output channel

## Future Enhancements

- Live Markdown preview
- Syntax highlighting
- Table formatting
- Image preview
- Export to PDF/HTML

## License

MIT
