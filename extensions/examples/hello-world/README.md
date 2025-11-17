# Hello World Extension

A simple example extension that demonstrates the basics of creating extensions for HarmonyOS Code Editor.

## Features

- Registers a "Hello World" command
- Shows an information message when the command is executed
- Creates an output channel for logging

## Usage

1. Press `Ctrl+Shift+P` to open the command palette
2. Type "Hello World: Say Hello"
3. Press Enter to execute the command
4. You'll see a "Hello World" information message

## Extension Structure

```
hello-world/
├── package.json       # Extension manifest
├── extension.ts       # Extension code
└── README.md         # This file
```

## Development

This extension serves as a starting point for developing your own extensions. Key concepts demonstrated:

### 1. Extension Manifest (package.json)

```json
{
  "activationEvents": [
    "onCommand:helloWorld.sayHello"
  ],
  "contributes": {
    "commands": [
      {
        "command": "helloWorld.sayHello",
        "title": "Hello World: Say Hello"
      }
    ]
  }
}
```

### 2. Extension Activation

```typescript
export function activate(context: ExtensionContext) {
  // Your extension code here
}
```

### 3. Registering Commands

```typescript
const disposable = commands.registerCommand('helloWorld.sayHello', () => {
  window.showInformationMessage('Hello World!');
});

context.subscriptions.push(disposable);
```

### 4. Extension Deactivation

```typescript
export function deactivate() {
  // Cleanup code here
}
```

## API Used

- `commands.registerCommand()` - Register a command
- `window.showInformationMessage()` - Show a message
- `window.createOutputChannel()` - Create an output channel
- `ExtensionContext` - Access extension context and subscriptions

## Learn More

- [Extension API Documentation](../../../docs/EXTENSION_API.md)
- [Extension Development Guide](../../../docs/EXTENSION_DEVELOPMENT.md)

## License

MIT
