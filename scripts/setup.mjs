// scripts/setup.mjs - Interactive template setup
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath, pathToFileURL } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cross-platform readline interface with better compatibility
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true, // Force terminal mode for better compatibility
});

// Ensure proper cleanup on exit
process.on('SIGINT', () => {
    rl.close();
    process.exit(0);
});

class TemplateSetup {
    constructor() {
        this.answers = {};
        this.rootDir = path.join(__dirname, '..');
        this.templatesDir = path.join(this.rootDir, 'templates');

        // Template file paths
        this.templatePaths = {
            packageJson: path.join(this.templatesDir, 'package.template.json'),
            readme: path.join(this.templatesDir, 'README.template.md'),
            changelog: path.join(this.templatesDir, 'CHANGELOG.template.md'),
            extension: path.join(this.templatesDir, 'src', 'extension.template.ts'),
            extensionTest: path.join(
                this.templatesDir,
                'src',
                'test',
                'extension.template.test.ts'
            ),
            integrationTest: path.join(
                this.templatesDir,
                'src',
                'test',
                'suite',
                'integration.template.test.ts'
            ),
        };

        // Target file paths
        this.targetPaths = {
            packageJson: path.join(this.rootDir, 'package.json'),
            readme: path.join(this.rootDir, 'README.md'),
            changelog: path.join(this.rootDir, 'CHANGELOG.md'),
            extension: path.join(this.rootDir, 'src', 'extension.ts'),
            extensionTest: path.join(this.rootDir, 'src', 'test', 'extension.test.ts'),
            integrationTest: path.join(this.rootDir, 'src', 'test', 'suite', 'integration.test.ts'),
        };
    }

    async run() {
        try {
            console.log('🚀 VS Code Extension Template Setup');
            console.log('=====================================\n');

            await this.gatherInfo();
            await this.processFiles();
            await this.cleanup();

            console.log('\n✨ Setup complete! Your extension is ready for development.');
            console.log('\nNext steps:');
            console.log('  1. npm install');
            console.log('  2. Press F5 to launch Extension Development Host');
            console.log('  3. Start building your extension!');
        } catch (error) {
            console.error('\n❌ Setup failed:', error.message);
            process.exit(1);
        } finally {
            rl.close();
        }
    }

    async gatherInfo() {
        try {
            this.answers.extensionName = await this.ask('Extension Name (kebab-case): ');
            this.answers.extensionDisplayName = await this.ask('\nExtension Display Name: ');
            this.answers.extensionDescription = await this.ask('\nExtension Description: ');
            this.answers.extensionPublisherID = await this.ask(
                '\nExtension Publisher Identifier: '
            );
            this.answers.extensionAuthorFullName = await this.ask('\nExtension Author Full Name: ');
            this.answers.githubUsername = await this.ask('\nGitHub Username: ');
            this.answers.repositoryName = await this.ask('\nRepository Name: ');
        } catch (error) {
            console.error('\nError gathering information:', error.message);
            throw error;
        }
    }

    async processFiles() {
        console.log('\n📝 Processing template files...');

        try {
            // Ensure target directories exist
            await this.ensureDirectoriesExist();

            // Process all template files
            await this.processPackageJson();
            await this.processReadme();
            await this.processChangelog();
            await this.processExtensionFile();
            await this.processTestFiles();
        } catch (error) {
            console.error('Error processing files:', error.message);
            throw error;
        }
    }

    async ensureDirectoriesExist() {
        const directories = [
            path.join(this.rootDir, 'src'),
            path.join(this.rootDir, 'src', 'test'),
            path.join(this.rootDir, 'src', 'test', 'suite'),
        ];

        directories.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`  ✓ Created directory: ${path.relative(this.rootDir, dir)}`);
            }
        });
    }

    async processPackageJson() {
        if (!fs.existsSync(this.templatePaths.packageJson)) {
            console.log('  ⚠️  package.template.json not found, skipping...');
            return;
        }

        const templateContent = fs.readFileSync(this.templatePaths.packageJson, 'utf8');
        const processedContent = this.replacePlaceholders(templateContent);

        // Backup original
        if (fs.existsSync(this.targetPaths.packageJson)) {
            fs.writeFileSync(
                this.targetPaths.packageJson + '.template-backup',
                fs.readFileSync(this.targetPaths.packageJson)
            );
        }

        // Write new package.json
        fs.writeFileSync(this.targetPaths.packageJson, processedContent);
        console.log('  ✓ Updated package.json');
    }

    async processReadme() {
        if (!fs.existsSync(this.templatePaths.readme)) {
            console.log('  ⚠️  README.template.md not found, skipping...');
            return;
        }

        const templateContent = fs.readFileSync(this.templatePaths.readme, 'utf8');
        const processedContent = this.replacePlaceholders(templateContent);

        // Backup original
        if (fs.existsSync(this.targetPaths.readme)) {
            fs.writeFileSync(
                this.targetPaths.readme + '.template-backup',
                fs.readFileSync(this.targetPaths.readme)
            );
        }

        // Write new README.md
        fs.writeFileSync(this.targetPaths.readme, processedContent);
        console.log('  ✓ Updated README.md');
    }

    async processChangelog() {
        if (!fs.existsSync(this.templatePaths.changelog)) {
            console.log('  ⚠️  CHANGELOG.template.md not found, skipping...');
            return;
        }

        const templateContent = fs.readFileSync(this.templatePaths.changelog, 'utf8');
        const processedContent = this.replacePlaceholders(templateContent);

        // Write new CHANGELOG.md
        fs.writeFileSync(this.targetPaths.changelog, processedContent);
        console.log('  ✓ Created CHANGELOG.md');
    }

    async processExtensionFile() {
        if (!fs.existsSync(this.templatePaths.extension)) {
            console.log('  ⚠️  extension.template.ts not found, skipping...');
            return;
        }

        const templateContent = fs.readFileSync(this.templatePaths.extension, 'utf8');
        const processedContent = this.replacePlaceholders(templateContent);

        // Write new extension.ts
        fs.writeFileSync(this.targetPaths.extension, processedContent);
        console.log('  ✓ Updated src/extension.ts');
    }

    async processTestFiles() {
        // Process extension test file
        if (fs.existsSync(this.templatePaths.extensionTest)) {
            const templateContent = fs.readFileSync(this.templatePaths.extensionTest, 'utf8');
            const processedContent = this.replacePlaceholders(templateContent);
            fs.writeFileSync(this.targetPaths.extensionTest, processedContent);
            console.log('  ✓ Updated src/test/extension.test.ts');
        } else {
            console.log('  ⚠️  extension.template.test.ts not found, skipping...');
        }

        // Process integration test file
        if (fs.existsSync(this.templatePaths.integrationTest)) {
            const templateContent = fs.readFileSync(this.templatePaths.integrationTest, 'utf8');
            const processedContent = this.replacePlaceholders(templateContent);
            fs.writeFileSync(this.targetPaths.integrationTest, processedContent);
            console.log('  ✓ Updated src/test/suite/integration.test.ts');
        } else {
            console.log('  ⚠️  integration.template.test.ts not found, skipping...');
        }
    }

    replacePlaceholders(content) {
        return content
            .replace(/\{\{extensionName\}\}/g, this.answers.extensionName)
            .replace(/\{\{extensionDisplayName\}\}/g, this.answers.extensionDisplayName)
            .replace(/\{\{extensionDescription\}\}/g, this.answers.extensionDescription)
            .replace(/\{\{extensionPublisherID\}\}/g, this.answers.extensionPublisherID)
            .replace(/\{\{extensionAuthorFullName\}\}/g, this.answers.extensionAuthorFullName)
            .replace(/\{\{githubUsername\}\}/g, this.answers.githubUsername)
            .replace(/\{\{repositoryName\}\}/g, this.answers.repositoryName);
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up template files...');

        const itemsToRemove = [
            'scripts',
            'templates',
            'README.md.template-backup',
            'package.json.template-backup',
        ];

        itemsToRemove.forEach((item) => {
            const fullPath = path.join(this.rootDir, item);
            if (fs.existsSync(fullPath)) {
                try {
                    if (fs.statSync(fullPath).isDirectory()) {
                        fs.rmSync(fullPath, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(fullPath);
                    }
                    console.log(`  ✓ Removed ${item}`);
                } catch (error) {
                    console.log(`  ⚠️  Could not remove ${item}: ${error.message}`);
                }
            }
        });
    }

    ask(question) {
        return new Promise((resolve, reject) => {
            // Force flush and display the question
            console.log(question);
            console.log('(Please type your answer and press Enter)');

            rl.question('> ', (answer) => {
                const trimmedAnswer = answer.trim();
                if (trimmedAnswer === '') {
                    console.log('Please provide a valid answer.');
                    return this.ask(question).then(resolve).catch(reject);
                }
                resolve(trimmedAnswer);
            });
        });
    }
}

// Cross-platform script execution check
function isMainModule() {
    // Convert both paths to file URLs for consistent comparison
    const scriptUrl = pathToFileURL(process.argv[1]).href;
    const moduleUrl = import.meta.url;

    return scriptUrl === moduleUrl;
}

// Run setup only when called directly (not when imported)
if (isMainModule()) {
    const setup = new TemplateSetup();
    setup.run().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export default TemplateSetup;
