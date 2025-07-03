# PQ Workspace DevKit

[![CI](https://github.com/ken-willis/pq-workspace-devkit/actions/workflows/ci.yml/badge.svg)](https://github.com/ken-willis/pq-workspace-devkit/actions/workflows/ci.yml)
[![Version](https://img.shields.io/visual-studio-marketplace/v/ken-willis.pq-workspace-devkit)](https://marketplace.visualstudio.com/items?itemName=ken-willis.pq-workspace-devkit)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/ken-willis.pq-workspace-devkit)](https://marketplace.visualstudio.com/items?itemName=ken-willis.pq-workspace-devkit)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/ken-willis.pq-workspace-devkit)](https://marketplace.visualstudio.com/items?itemName=ken-willis.pq-workspace-devkit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Transforms Power Query development by automatically scanning your workspace and generating intelligent symbol files that unlock full cross-file IntelliSense support.

## Features

### 🚀 Core Capabilities

- **🔍 Automatic Symbol Discovery** - Scans all Power Query files in your workspace
  - Default extensions: `.pq`, `.pqout`, `.pqm`, `.m`, `.mout`
  - Plus any custom extensions you configure
- **🧠 Intelligent IntelliSense** - Full auto-completion across all workspace files
- **📝 Rich Documentation** - Hover for detailed parameter information and function signatures
- **🔄 Real-Time Updates** - Automatically refreshes symbols when files change
- **📁 Workspace-Relative Paths** - No absolute path dependencies
- **🔌 Seamless Integration** - Works perfectly with Microsoft's Power Query extension

### 🎯 How It Works

1. **Scans** your workspace for Power Query files
2. **Extracts** functions, records, variables, and their documentation
3. **Generates** Microsoft-compatible symbol files
4. **Configures** VS Code to use the symbols automatically
5. **Updates** in real-time as you edit files

![PQ Workspace DevKit in action](images/demo.gif)

## Requirements

- Visual Studio Code ^1.101.0
- [Microsoft Power Query extension](https://marketplace.visualstudio.com/items?itemName=PowerQuery.vscode-powerquery)

## Installation

### From VS Code Marketplace

1. Open Visual Studio Code
2. Press `Ctrl+P` / `Cmd+P` to open Quick Open
3. Type `ext install ken-willis.pq-workspace-devkit`
4. Press Enter

### From Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Extensions: Install Extensions"
3. Search for "PQ Workspace DevKit"
4. Click Install

## Usage

The extension activates automatically when you:
- Open a workspace containing Power Query files (`.pq`, `.pqout`, `.pqm`, `.m`, `.mout`)
- Open any Power Query file
- Run any extension command

### Available Commands

Access these commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `PQ Workspace DevKit: Refresh Symbols` | Manually scan workspace and regenerate all symbols |
| `PQ Workspace DevKit: Generate Test Symbols` | Create sample symbols for testing |
| `PQ Workspace DevKit: Clean Up Symbol Files` | Remove all generated symbol files |
| `PQ Workspace DevKit: Configure Microsoft Extension` | Set up integration with Power Query extension |
| `PQ Workspace DevKit: Show Status` | Display current extension status and statistics |

## Extension Settings

Configure the extension via VS Code settings:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `pq-workspace-devkit.fileExtensions` | array | `[".pq", ".pqout", ".pqm", ".m", ".mout"]` | File extensions to scan for symbols. Add custom extensions as needed. |
| `pq-workspace-devkit.symbolsDirectory` | string | `""` | Custom symbols directory (relative to workspace) |
| `pq-workspace-devkit.autoGenerate` | boolean | `true` | Auto-generate symbols on workspace open |
| `pq-workspace-devkit.excludePatterns` | array | `["**/node_modules/**", "**/.git/**"]` | Glob patterns to exclude from scanning |
| `pq-workspace-devkit.enableLogging` | boolean | `false` | Enable debug logging to console |
| `pq-workspace-devkit.updateOnSave` | boolean | `true` | Update symbols when Power Query files are saved |

### Example Configuration

```json
{
    "pq-workspace-devkit.symbolsDirectory": ".symbols",
    "pq-workspace-devkit.fileExtensions": [
        ".pq", ".pqout", ".pqm", ".m", ".mout",
        ".pquery"  // Custom extension
    ],
    "pq-workspace-devkit.excludePatterns": [
        "**/node_modules/**",
        "**/.git/**",
        "**/archived/**"
    ],
    "pq-workspace-devkit.enableLogging": true
}
```

## Symbol Generation

The extension generates symbols for:

- **Functions** - Including parameters, types, and documentation
- **Variables** - With inferred types and values
- **Records** - Including nested field structures
- **Comments** - Extracted as documentation

### Example Power Query Code

```powerquery
// Transforms a table with the specified options
TransformTable = (table as table, optional options as record) =>
    let
        // Default configuration
        config = [
            RemoveErrors = true,
            SortColumns = false
        ],
        
        // Merge with user options
        finalConfig = config & (options ?? [])
    in
        Table.TransformColumns(table, {});
```

### Generated Symbol Structure

The extension creates Microsoft-compatible JSON symbols with full IntelliSense support for:
- Function signatures with parameter hints
- Record field completion (`config[RemoveErrors]`)
- Type information and documentation
- Optional and nullable parameter handling

## Known Issues

- Symbol generation for complex nested let expressions may miss some bindings
- Documentation extraction limited to single-line comments above declarations
- See [GitHub Issues](https://github.com/ken-willis/pq-workspace-devkit/issues) for all known issues

## Release Notes

### 0.0.1 (Initial Release)

- 🎉 Initial release with core functionality
- ✨ Automatic workspace scanning for Power Query files
- 🧠 Symbol generation for functions, variables, and records
- 🔄 Real-time symbol updates on file changes
- 🔌 Microsoft Power Query extension integration

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Technical Details

This extension leverages Microsoft's native symbol system through the `powerquery.client.additionalSymbolsDirectories` setting. It generates JSON symbol files that provide:

- Deep IntelliSense integration
- Record field completion
- Function parameter hints
- Rich hover documentation
- Cross-file symbol resolution

Perfect for Power BI developers, data engineers, and anyone building complex Power Query solutions with multiple files.

## Support

- **🐛 Issues**: [GitHub Issues](https://github.com/ken-willis/pq-workspace-devkit/issues)
- **📖 Documentation**: [GitHub Repository](https://github.com/ken-willis/pq-workspace-devkit)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ken-willis/pq-workspace-devkit/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy enhanced Power Query development!**