# VS Code Extension Template

[![CI](https://github.com/ken-willis/vscode-extension-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ken-willis/vscode-extension-template/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Template](https://img.shields.io/badge/template-VS%20Code%20Extension-blue.svg)](https://github.com/ken-willis/vscode-extension-template)

A professional TypeScript VS Code extension starter template with ESLint, Prettier, EditorConfig, testing, GitHub Actions CI, and complete development tooling pre-configured.

## 🚀 Quick Start

1. **Use this template** - Click "Use this template" button above
2. **Clone your new repository**
3. **Run setup script**: `& "C:\Program Files\Git\bin\bash.exe" -c "node scripts/setup.mjs"`
4. **Follow interactive prompts** to customize your extension
5. **Install dependencies**: `npm install`
6. **Start developing**: Press `F5` to launch Extension Development Host

## ✨ What's Included

-   **TypeScript** - Full TypeScript configuration with strict settings
-   **ESLint** - Code linting with TypeScript support
-   **Prettier** - Code formatting with format-on-save
-   **EditorConfig** - Consistent formatting across editors and platforms
-   **Testing Framework** - Complete test setup with examples
-   **GitHub Actions CI** - Automated testing on Windows, Mac, and Linux
-   **Git Configuration** - Proper .gitignore, .gitattributes for cross-platform development
-   **VS Code Integration** - Optimized settings, tasks, and debug configuration
-   **Professional Structure** - Industry-standard project organization
-   **Interactive Setup** - One-command customization script

## 📋 Prerequisites

Before using this template, ensure you have:

### Required Software

-   **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
-   **Git** - [Download here](https://git-scm.com/)
-   **Visual Studio Code** - [Download here](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show npm version
git --version     # Should show git version
code --version    # Should show VS Code version
```

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

-   **TypeScript and JavaScript Language Features** (built-in)
-   **ESLint** (Microsoft)
-   **Prettier - Code formatter** (Prettier)
-   **GitLens** (GitKraken)
-   **Extension Test Runner** (Microsoft)

## 🛠️ Setup & Customization

### Automated Setup (Recommended)

After cloning your repository from this template:

```bash
# Run the interactive setup script
node scripts/setup.mjs
```

The script will prompt you for:

-   Extension name (kebab-case)
-   Display name
-   Description
-   Publisher name
-   Author name
-   GitHub username
-   Repository name

It will automatically:

-   ✅ Update package.json with your details
-   ✅ Replace command names in extension.ts
-   ✅ Update test files with correct extension ID
-   ✅ Generate a new README for your extension
-   ✅ Update CHANGELOG with your extension info
-   ✅ Configure VS Code settings
-   ✅ Clean up template files

### Manual Customization (Alternative)

If you prefer manual setup, update these files:

#### 1. Update package.json

```json
{
    "name": "your-extension-name",
    "displayName": "Your Extension Display Name",
    "description": "What your extension does",
    "publisher": "your-ms-publisher-id",
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

#### 2. Update Commands in package.json

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

#### 3. Update src/extension.ts

-   Replace command names with your extension's commands
-   Add your extension logic
-   Update activation events as needed

#### 4. Update Tests

Replace extension ID in test files:

```typescript
vscode.extensions.getExtension('your-publisher.your-extension-name');
```

## 📋 Development Workflow

### Available Scripts

-   `npm run compile` - Compile TypeScript to JavaScript
-   `npm run watch` - Watch for changes and compile automatically
-   `npm run lint` - Run ESLint on source code
-   `npm test` - Run extension tests
-   `npm run vscode:prepublish` - Prepare for publishing

### Debugging Your Extension

-   Press `F5` to open Extension Development Host with your extension loaded
-   Run commands from Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
-   Set breakpoints in `src/extension.ts` to debug your code
-   View output in the Debug Console
-   Reload the extension window (`Ctrl+R` / `Cmd+R`) after code changes

### Running Tests

-   Tests use VS Code's built-in testing framework (included)
-   **Optional:** Install [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) for UI testing
-   Run tests via command line: `npm test`
-   Or use VS Code's Testing panel if Extension Test Runner is installed
-   Test files must match pattern `**.test.ts`

### Dependency Management

When customizing your extension, you may need to add packages:

```bash
npm install your-package          # Runtime dependency
npm install --save-dev dev-tool   # Development dependency
npm uninstall package-name        # Remove dependency
```

**When to run npm install:**

-   **After adding dependencies** - When you modify package.json dependencies
-   **Team collaboration** - When package-lock.json changes from Git pulls
-   **Troubleshooting** - If node_modules gets corrupted or deleted

**Always commit package-lock.json changes** to ensure team consistency.

```bash
# Clean install (if issues occur)
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Debugging Guide

### Common Issues and Solutions

#### Extension Won't Activate

1. **Check console errors**: Open Developer Tools (Help → Toggle Developer Tools)
2. **Verify package.json**: Ensure activation events are correct
3. **Check file paths**: Ensure main file path is correct

#### Tests Not Running

1. **Install Extension Test Runner**: In VS Code Extensions panel
2. **Run compile**: `npm run compile`
3. **Check test files**: Must end with `.test.ts`

#### TypeScript Errors

1. **Check tsconfig.json**: Ensure paths are correct
2. **Restart TypeScript**: Command Palette → "TypeScript: Restart TS Server"
3. **Clear compiled output**: Delete `out/` folder and recompile

### Step-by-Step Debugging

1. **Launch Extension Development Host**: Press `F5`
2. **Set breakpoints**: Click in gutter next to line numbers
3. **Trigger command**: Use Command Palette in development host
4. **Inspect variables**: Hover over variables or use Debug Console

## 📦 Publishing Your Extension

### Prepare for Publishing

#### 1. Install vsce (VS Code Extension Manager)

```bash
npm install -g vsce
```

#### 2. Create Publisher Account

1. Visit [VS Code Marketplace](https://marketplace.visualstudio.com/manage)
2. Sign in with Microsoft account
3. Create publisher profile

#### 3. Update Extension Details

Ensure your package.json has:

-   Correct publisher name
-   Updated version number
-   Complete description
-   Proper categories and keywords

### Publishing Commands

#### Package Extension (Create .vsix file)

```bash
vsce package
```

#### Validate Package

```bash
vsce ls                    # List package contents
vsce show <publisher.name> # Show published info
```

#### Publish to Marketplace

```bash
# Login (first time only)
vsce login <publisher-name>

# Publish
vsce publish

# Publish with version bump
vsce publish patch   # 1.0.0 → 1.0.1
vsce publish minor   # 1.0.0 → 1.1.0
vsce publish major   # 1.0.0 → 2.0.0
```

### Pre-Publishing Checklist

-   [ ] All tests pass (`npm test`)
-   [ ] Extension packages without errors (`vsce package`)
-   [ ] README has screenshots/GIFs of features
-   [ ] CHANGELOG.md is updated
-   [ ] Version number incremented
-   [ ] Icon added (128x128 PNG)
-   [ ] Repository URL is correct

## 📁 Project Structure

```
your-extension/
├── .github/              # GitHub Actions CI/CD
│   └── workflows/
│       └── ci.yml
├── .vscode/              # VS Code settings and tasks
├── src/                  # TypeScript source code
│   ├── extension.ts      # Main extension file
│   └── test/             # Test files
├── templates/            # Template files (removed after setup)
├── scripts/              # Setup scripts (removed after setup)
├── .editorconfig         # Editor configuration
├── .gitattributes        # Git line ending settings
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier formatting rules
├── package.json          # Extension manifest
└── tsconfig.json         # TypeScript configuration
```

## 🎯 Extension Guidelines

Follow VS Code extension best practices:

-   **Activation Events** - Only activate when needed
-   **Commands** - Use clear, descriptive command names
-   **Settings** - Prefix with your extension name
-   **Performance** - Keep activation time minimal
-   **User Experience** - Provide clear feedback and error messages

### Useful Resources

-   [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
-   [Extension API](https://code.visualstudio.com/api)
-   [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

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

After setup, your extension will have a basic README. Enhance it with:

### Essential Sections

-   **Features** - What your extension does with screenshots/GIFs
-   **Requirements** - Dependencies or prerequisites
-   **Extension Settings** - Configuration options you add
-   **Known Issues** - Current limitations
-   **Release Notes** - Version history

### README Tips

-   **Use screenshots** - Show your extension in action
-   **Include GIFs** - Demonstrate features visually
-   **Be specific** - Clear, concise feature descriptions
-   **Keep updated** - Maintain accurate documentation

## 🏆 Badges for Your Extension

Add these badges to your extension's README:

```markdown
[![CI](https://github.com/your-username/your-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/your-extension/actions/workflows/ci.yml)
[![Version](https://img.shields.io/visual-studio-marketplace/v/your-publisher.your-extension)](https://marketplace.visualstudio.com/items?itemName=your-publisher.your-extension)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/your-publisher.your-extension)](https://marketplace.visualstudio.com/items?itemName=your-publisher.your-extension)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/your-publisher.your-extension)](https://marketplace.visualstudio.com/items?itemName=your-publisher.your-extension)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
```

## 🤝 Contributing

This template is open source. Feel free to:

-   Report issues
-   Suggest improvements
-   Submit pull requests
-   Fork for your own use

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Extension Development!** 🎉

Built with ❤️ by [Ken Willis](https://github.com/ken-willis)

_This template provides everything you need to create professional VS Code extensions with modern development practices and automated CI/CD._
