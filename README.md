# VS Code Extension Template

A professional TypeScript VS Code extension starter template with ESLint, Prettier, EditorConfig, testing, and complete development tooling pre-configured.

## 🚀 Quick Start

1. **Use this template** - Click "Use this template" button above
2. **Clone your new repository**
3. **Install dependencies**: `npm install`
4. **Customize for your extension** (see [Customization](#customization) below)
5. **Start developing**: Press `F5` to launch Extension Development Host

## ✨ What's Included

- **TypeScript** - Full TypeScript configuration with strict settings
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting with format-on-save
- **EditorConfig** - Consistent formatting across editors and platforms
- **Testing Framework** - Complete test setup with examples
- **Git Configuration** - Proper .gitignore, .gitattributes for cross-platform development
- **VS Code Integration** - Optimized settings, tasks, and debug configuration
- **Professional Structure** - Industry-standard project organization

## 🛠️ Customization

After creating your repository from this template, update these files:

### 1. Update package.json
```json
{
  "name": "your-extension-name",
  "displayName": "Your Extension Display Name", 
  "description": "What your extension does",
  "publisher": "your-publisher-name",
  "author": "Your Name",
  "repository": {
    "url": "https://github.com/your-username/your-repository-name"
  },
  "bugs": {
    "url": "https://github.com/your-username/your-repository-name/issues"
  },
  "homepage": "https://github.com/your-username/your-repository-name#readme"
}
```

### 2. Update Commands in package.json
Replace the template command with your extension's commands:
```json
"contributes": {
  "commands": [
    {
      "command": "your-extension-name.yourCommand",
      "title": "Your Command",
      "category": "Your Extension"
    }
  ]
}
```

### 3. Update src/extension.ts
- Replace `your-extension-name.yourCommand` with your command names
- Add your extension logic
- Update activation events as needed

### 4. Update This README
Replace this template README with documentation for your extension.

## 📋 Development Workflow

### Available Scripts
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile automatically  
- `npm run lint` - Run ESLint on source code
- `npm test` - Run extension tests
- `npm run vscode:prepublish` - Prepare for publishing

### Debugging Your Extension
- Press `F5` to open Extension Development Host with your extension loaded
- Run commands from Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Set breakpoints in `src/extension.ts` to debug your code
- View output in the Debug Console
- Reload the extension window (`Ctrl+R` / `Cmd+R`) after code changes

### Running Tests
- Tests use VS Code's built-in testing framework (included)
- **Optional:** Install [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) for UI testing
- Run tests via command line: `npm test`
- Or use VS Code's Testing panel if Extension Test Runner is installed
- Test files must match pattern `**.test.ts`

### Dependency Management
When customizing your extension, you may need to add packages:

```bash
npm install your-package          # Runtime dependency
npm install --save-dev dev-tool   # Development dependency
npm uninstall package-name        # Remove dependency
```

**When to run npm install:**
- **After adding dependencies** - When you modify package.json dependencies
- **Team collaboration** - When package-lock.json changes from Git pulls
- **Troubleshooting** - If node_modules gets corrupted or deleted

**Always commit package-lock.json changes** to ensure team consistency.

```bash
# Clean install (if issues occur)
rm -rf node_modules package-lock.json
npm install
```

## 📦 Publishing

### Prepare for Publishing
1. Install vsce: `npm install -g vsce`
2. Update version in package.json
3. Ensure all fields in package.json are correct
4. Add icon.png (128x128) if desired
5. Test thoroughly with `vsce package`

### Publish to Marketplace
```bash
vsce package      # Creates .vsix file
vsce publish      # Publishes to VS Code Marketplace
```

## 📁 Project Structure

```
your-extension/
├── .vscode/          # VS Code settings and tasks
├── src/              # TypeScript source code
│   ├── extension.ts  # Main extension file
│   └── test/         # Test files
├── .editorconfig     # Editor configuration
├── .gitattributes    # Git line ending settings
├── .gitignore        # Git ignore rules
├── .prettierrc       # Prettier formatting rules
├── package.json      # Extension manifest
└── tsconfig.json     # TypeScript configuration
```

## 🎯 Extension Guidelines

Follow VS Code extension best practices:

- **Activation Events** - Only activate when needed
- **Commands** - Use clear, descriptive command names
- **Settings** - Prefix with your extension name
- **Performance** - Keep activation time minimal
- **User Experience** - Provide clear feedback and error messages

### Useful Resources
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Extension API](https://code.visualstudio.com/api)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## 🔧 Advanced Configuration

### Adding Extension Settings
```json
"contributes": {
  "configuration": {
    "title": "Your Extension",
    "properties": {
      "yourExtension.enabled": {
        "type": "boolean",
        "default": true,
        "description": "Enable/disable your extension"
      }
    }
  }
}
```

### Adding Keybindings
```json
"contributes": {
  "keybindings": [
    {
      "command": "yourExtension.yourCommand",
      "key": "ctrl+shift+y",
      "when": "editorTextFocus"
    }
  ]
}
```

## 📝 Writing Your Extension README

When you're ready to document your extension, include these sections:

### Essential Sections
- **Features** - What your extension does with screenshots/GIFs
- **Requirements** - Dependencies or prerequisites  
- **Extension Settings** - Configuration options you add
- **Known Issues** - Current limitations
- **Release Notes** - Version history

### README Tips
- **Use screenshots** - Show your extension in action
- **Include GIFs** - Demonstrate features visually
- **Be specific** - Clear, concise feature descriptions
- **Keep updated** - Maintain accurate documentation

## 🤝 Contributing

This template is open source. Feel free to:
- Report issues
- Suggest improvements  
- Submit pull requests
- Fork for your own use

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Extension Development!** 🎉

Built with ❤️ by [Ken Willis](https://github.com/ken-willis)