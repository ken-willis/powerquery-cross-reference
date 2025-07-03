# Project Structure

Generated: 2025-06-28 10:38:31
Max Upload Size: 100KB
[MY-FOLDER:HIDDEN] **.claude/**
  [MY-FILE:UPLOAD] **artifact-types.json** - .claude/artifact-types.json
  [MY-FILE:UPLOAD] **project-metadata.json** - .claude/project-metadata.json
  [MY-FILE:UPLOAD] **structure.md** - .claude/structure.md
  [MY-FILE:UPLOAD] **upload-recommendations.md** - .claude/upload-recommendations.md
[MY-FOLDER:HIDDEN] **.github/**
  [MY-FOLDER] **workflows/**
    [MY-FILE:UPLOAD] **ci.yml** - .github/workflows/ci.yml
[REF-FOLDER:HIDDEN] **.reference/**
  [REF-FOLDER] **microsoft/**
    [REF-FOLDER] **vscode-powerquery/**
      [REF-FILE:UPLOAD] **.eslintrc.js** - .reference/microsoft/vscode-powerquery/.eslintrc.js
      [REF-FOLDER:HIDDEN] **.github/**
        [REF-FOLDER] **ISSUE_TEMPLATE/**
          [REF-FILE:UPLOAD] **bug_report.md** - .reference/microsoft/vscode-powerquery/.github/ISSUE_TEMPLATE/bug_report.md
          [REF-FILE:UPLOAD] **feature_request.md** - .reference/microsoft/vscode-powerquery/.github/ISSUE_TEMPLATE/feature_request.md
        [REF-FOLDER] **workflows/**
          [REF-FILE:UPLOAD] **pr-gated.yml** - .reference/microsoft/vscode-powerquery/.github/workflows/pr-gated.yml
      [REF-FOLDER] **client/**
        [REF-FILE:UPLOAD] **.eslintrc.js** - .reference/microsoft/vscode-powerquery/client/.eslintrc.js
        [REF-FILE:UPLOAD] **.vscode-test.js** - .reference/microsoft/vscode-powerquery/client/.vscode-test.js
        [REF-FILE:UPLOAD] **package.json** - .reference/microsoft/vscode-powerquery/client/package.json
        [REF-FILE:OPTIONAL,LARGE-290.6KB] **package-lock.json** - .reference/microsoft/vscode-powerquery/client/package-lock.json
        [REF-FOLDER] **src/**
          [REF-FILE:UPLOAD] **commands.ts** - .reference/microsoft/vscode-powerquery/client/src/commands.ts
          [REF-FILE:UPLOAD] **constants.ts** - .reference/microsoft/vscode-powerquery/client/src/constants.ts
          [REF-FILE:UPLOAD] **dataflowModel.ts** - .reference/microsoft/vscode-powerquery/client/src/dataflowModel.ts
          [REF-FILE:UPLOAD] **extension.ts** - .reference/microsoft/vscode-powerquery/client/src/extension.ts
          [REF-FILE:UPLOAD] **funcUtils.ts** - .reference/microsoft/vscode-powerquery/client/src/funcUtils.ts
          [REF-FILE:UPLOAD] **librarySymbolClient.ts** - .reference/microsoft/vscode-powerquery/client/src/librarySymbolClient.ts
          [REF-FILE:UPLOAD] **librarySymbolManager.ts** - .reference/microsoft/vscode-powerquery/client/src/librarySymbolManager.ts
          [REF-FILE:UPLOAD] **librarySymbolUtils.ts** - .reference/microsoft/vscode-powerquery/client/src/librarySymbolUtils.ts
          [REF-FILE:UPLOAD] **powerQueryApi.ts** - .reference/microsoft/vscode-powerquery/client/src/powerQueryApi.ts
          [REF-FOLDER] **subscriptions/**
            [REF-FILE:UPLOAD] **documentSemanticTokensProvider.ts** - .reference/microsoft/vscode-powerquery/client/src/subscriptions/documentSemanticTokensProvider.ts
            [REF-FILE:UPLOAD] **index.ts** - .reference/microsoft/vscode-powerquery/client/src/subscriptions/index.ts
          [REF-FOLDER] **test/**
            [REF-FOLDER] **suite/**
              [REF-FILE:UPLOAD] **completion.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/completion.test.ts
              [REF-FILE:UPLOAD] **completionUtils.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/completionUtils.ts
              [REF-FILE:UPLOAD] **dataflowExtractCommand.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/dataflowExtractCommand.test.ts
              [REF-FILE:UPLOAD] **diagnostics.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/diagnostics.test.ts
              [REF-FILE:UPLOAD] **documentSymbols.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/documentSymbols.test.ts
              [REF-FILE:UPLOAD] **documentSymbolUtils.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/documentSymbolUtils.ts
              [REF-FILE:UPLOAD] **encodingCommands.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/encodingCommands.test.ts
              [REF-FILE:UPLOAD] **extension.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/extension.test.ts
              [REF-FILE:UPLOAD] **librarySymbolManager.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/librarySymbolManager.test.ts
              [REF-FILE:UPLOAD] **librarySymbolUtils.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/librarySymbolUtils.test.ts
              [REF-FILE:UPLOAD] **sectionCompletion.test.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/sectionCompletion.test.ts
              [REF-FILE:UPLOAD] **testUtils.ts** - .reference/microsoft/vscode-powerquery/client/src/test/suite/testUtils.ts
            [REF-FOLDER] **testFixture/**
              [REF-FILE:UPLOAD] **completion.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/completion.pq
              [REF-FILE:UPLOAD] **dataflow.json** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/dataflow.json
              [REF-FILE:UPLOAD] **Diagnostics.ExternalLibrarySymbol.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/Diagnostics.ExternalLibrarySymbol.pq
              [REF-FILE:UPLOAD] **Diagnostics.NoErrors.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/Diagnostics.NoErrors.pq
              [REF-FILE:UPLOAD] **diagnostics.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/diagnostics.pq
              [REF-FILE:UPLOAD] **Diagnostics.TableIsEmpty.Error.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/Diagnostics.TableIsEmpty.Error.pq
              [REF-FILE:UPLOAD] **DocumentSymbols.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/DocumentSymbols.pq
              [REF-FILE:UPLOAD] **ExtensionTest.json** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/ExtensionTest.json
              [REF-FILE:UPLOAD] **section.pq** - .reference/microsoft/vscode-powerquery/client/src/test/testFixture/section.pq
        [REF-FILE:UPLOAD] **tsconfig.json** - .reference/microsoft/vscode-powerquery/client/tsconfig.json
        [REF-FILE:UPLOAD] **tsconfig.webpack.json** - .reference/microsoft/vscode-powerquery/client/tsconfig.webpack.json
        [REF-FILE:UPLOAD] **webpack.config.js** - .reference/microsoft/vscode-powerquery/client/webpack.config.js
      [REF-FOLDER] **imgs/**
      [REF-FILE:UPLOAD] **language-configuration.json** - .reference/microsoft/vscode-powerquery/language-configuration.json
      [REF-FILE:UPLOAD] **package.json** - .reference/microsoft/vscode-powerquery/package.json
      [REF-FILE:OPTIONAL] **package-lock.json** - .reference/microsoft/vscode-powerquery/package-lock.json
      [REF-FILE:UPLOAD] **README.md** - .reference/microsoft/vscode-powerquery/README.md
      [REF-FOLDER] **scripts/**
        [REF-FILE:UPLOAD] **.eslintrc.js** - .reference/microsoft/vscode-powerquery/scripts/.eslintrc.js
        [REF-FILE:UPLOAD] **package.json** - .reference/microsoft/vscode-powerquery/scripts/package.json
        [REF-FILE:OPTIONAL,LARGE-115.5KB] **package-lock.json** - .reference/microsoft/vscode-powerquery/scripts/package-lock.json
        [REF-FILE:UPLOAD] **readme.md** - .reference/microsoft/vscode-powerquery/scripts/readme.md
        [REF-FOLDER] **src/**
          [REF-FILE:UPLOAD] **benchmarkFile.ts** - .reference/microsoft/vscode-powerquery/scripts/src/benchmarkFile.ts
        [REF-FILE:UPLOAD] **tsconfig.json** - .reference/microsoft/vscode-powerquery/scripts/tsconfig.json
      [REF-FILE:UPLOAD] **SECURITY.md** - .reference/microsoft/vscode-powerquery/SECURITY.md
      [REF-FOLDER] **server/**
        [REF-FILE:UPLOAD] **.eslintrc.js** - .reference/microsoft/vscode-powerquery/server/.eslintrc.js
        [REF-FILE:UPLOAD] **.mocharc.json** - .reference/microsoft/vscode-powerquery/server/.mocharc.json
        [REF-FILE:UPLOAD] **mochaReporterConfig.json** - .reference/microsoft/vscode-powerquery/server/mochaReporterConfig.json
        [REF-FILE:UPLOAD] **package.json** - .reference/microsoft/vscode-powerquery/server/package.json
        [REF-FILE:OPTIONAL,LARGE-138.6KB] **package-lock.json** - .reference/microsoft/vscode-powerquery/server/package-lock.json
        [REF-FOLDER] **src/**
          [REF-FOLDER] **cancellationToken/**
            [REF-FILE:UPLOAD] **cancellationTokenAdapter.ts** - .reference/microsoft/vscode-powerquery/server/src/cancellationToken/cancellationTokenAdapter.ts
            [REF-FILE:UPLOAD] **cancellationTokenUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/cancellationToken/cancellationTokenUtils.ts
            [REF-FILE:UPLOAD] **index.ts** - .reference/microsoft/vscode-powerquery/server/src/cancellationToken/index.ts
          [REF-FILE:UPLOAD] **errorUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/errorUtils.ts
          [REF-FILE:UPLOAD] **eventHandlerUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/eventHandlerUtils.ts
          [REF-FILE:UPLOAD] **index.ts** - .reference/microsoft/vscode-powerquery/server/src/index.ts
          [REF-FOLDER] **library/**
            [REF-FILE:UPLOAD] **externalLibraryUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/library/externalLibraryUtils.ts
            [REF-FILE:UPLOAD] **index.ts** - .reference/microsoft/vscode-powerquery/server/src/library/index.ts
            [REF-FILE:UPLOAD] **librarySymbolUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/library/librarySymbolUtils.ts
            [REF-FILE:UPLOAD] **libraryTypeResolver.ts** - .reference/microsoft/vscode-powerquery/server/src/library/libraryTypeResolver.ts
            [REF-FILE:UPLOAD] **libraryUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/library/libraryUtils.ts
            [REF-FILE:UPLOAD] **moduleLibraryUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/library/moduleLibraryUtils.ts
            [REF-FOLDER] **sdk/**
              [REF-FILE:OPTIONAL,LARGE-843.1KB] **sdk-enUs.json** - .reference/microsoft/vscode-powerquery/server/src/library/sdk/sdk-enUs.json
            [REF-FOLDER] **standard/**
              [REF-FILE:OPTIONAL,LARGE-820KB] **standard-enUs.json** - .reference/microsoft/vscode-powerquery/server/src/library/standard/standard-enUs.json
          [REF-FILE:UPLOAD] **server.ts** - .reference/microsoft/vscode-powerquery/server/src/server.ts
          [REF-FOLDER] **settings/**
            [REF-FILE:UPLOAD] **index.ts** - .reference/microsoft/vscode-powerquery/server/src/settings/index.ts
            [REF-FILE:UPLOAD] **settings.ts** - .reference/microsoft/vscode-powerquery/server/src/settings/settings.ts
            [REF-FILE:UPLOAD] **settingsUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/settings/settingsUtils.ts
          [REF-FOLDER] **test/**
            [REF-FILE:UPLOAD] **errorUtils.test.ts** - .reference/microsoft/vscode-powerquery/server/src/test/errorUtils.test.ts
            [REF-FILE:UPLOAD] **standardLibrary.test.ts** - .reference/microsoft/vscode-powerquery/server/src/test/standardLibrary.test.ts
          [REF-FILE:UPLOAD] **traceManagerUtils.ts** - .reference/microsoft/vscode-powerquery/server/src/traceManagerUtils.ts
        [REF-FILE:UPLOAD] **tsconfig.json** - .reference/microsoft/vscode-powerquery/server/tsconfig.json
        [REF-FILE:UPLOAD] **tsconfig.webpack.json** - .reference/microsoft/vscode-powerquery/server/tsconfig.webpack.json
        [REF-FILE:UPLOAD] **webpack.config.js** - .reference/microsoft/vscode-powerquery/server/webpack.config.js
      [REF-FOLDER] **syntaxes/**
        [REF-FILE:UPLOAD] **powerquery.tmLanguage.json** - .reference/microsoft/vscode-powerquery/syntaxes/powerquery.tmLanguage.json
      [REF-FILE:UPLOAD] **tsconfig.json** - .reference/microsoft/vscode-powerquery/tsconfig.json
[MY-FILE:UPLOAD] **CHANGELOG.md** - CHANGELOG.md
[MY-FILE:UPLOAD] **CONTRIBUTING.md** - CONTRIBUTING.md
[MY-FILE:UPLOAD] **package.json** - package.json
[MY-FILE:OPTIONAL,LARGE-143.1KB] **package-lock.json** - package-lock.json
[MY-FILE:UPLOAD] **README.md** - README.md
[MY-FOLDER] **scripts/**
[MY-FOLDER] **src/**
  [MY-FILE:UPLOAD] **extension.ts** - src/extension.ts
  [MY-FOLDER] **test/**
    [MY-FILE:UPLOAD] **extension.test.ts** - src/test/extension.test.ts
    [MY-FOLDER] **suite/**
      [MY-FILE:UPLOAD] **integration.test.ts** - src/test/suite/integration.test.ts
[MY-FOLDER] **templates/**
  [MY-FILE:UPLOAD] **CHANGELOG.template.md** - templates/CHANGELOG.template.md
  [MY-FILE:UPLOAD] **package.template.json** - templates/package.template.json
  [MY-FILE:UPLOAD] **README.template.md** - templates/README.template.md
  [MY-FOLDER] **src/**
    [MY-FILE:UPLOAD] **extension.template.ts** - templates/src/extension.template.ts
    [MY-FOLDER] **test/**
      [MY-FILE:UPLOAD] **extension.template.test.ts** - templates/src/test/extension.template.test.ts
      [MY-FOLDER] **suite/**
        [MY-FILE:UPLOAD] **integration.template.test.ts** - templates/src/test/suite/integration.template.test.ts
[MY-FILE:UPLOAD] **tsconfig.json** - tsconfig.json

---

## Enhanced File Classification Legend

### Base Types
- **[MY-FILE/FOLDER]** = Your implementation code
- **[REF-FILE/FOLDER]** = External reference material

### Automated Characteristics
- **UPLOAD** = Suitable for Claude project knowledge (<100KB, text, relevant)
- **NO-UPLOAD** = Binary files (images, executables, archives)
- **GENERATED** = Auto-generated files (build output, compiled files)
- **OPTIONAL** = Keep local unless needed (too large, logs, lock files)
- **LARGE-XKB** = File size indicator for large files
- **HIDDEN** = Hidden folders (start with .)

### Upload Recommendations Summary
- **High Priority**: 76 files (core config & source files)
- **Medium Priority**: 11 files (documentation & configs)
- **Optional**: 19 files (additional context)
- **Skip**: 6 files (binary, generated, or too large)

## Usage Notes
- Files marked **UPLOAD** are automatically identified as good candidates for Claude project knowledge
- Claude can request to see any file marked **OPTIONAL** if needed for context
- **NO-UPLOAD** and **GENERATED** files are typically excluded from upload recommendations
- Use this structure to understand your project layout and make informed upload decisions

See project knowledge instructions for how Claude should use this structure.
