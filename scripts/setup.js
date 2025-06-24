// scripts/setup.js - Interactive template setup
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
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
            extensionTest: path.join(this.templatesDir, 'src', 'test', 'extension.template.test.ts'),
            integrationTest: path.join(this.templatesDir, 'src', 'test', 'suite', 'integration.template.test.ts')
        };
        
        // Target file paths
        this.targetPaths = {
            packageJson: path.join(this.rootDir, 'package.json'),
            readme: path.join(this.rootDir, 'README.md'),
            changelog: path.join(this.rootDir, 'CHANGELOG.md'),
            extension: path.join(this.rootDir, 'src', 'extension.ts'),
            extensionTest: path.join(this.rootDir, 'src', 'test', 'extension.test.ts'),
            integrationTest: path.join(this.rootDir, 'src', 'test', 'suite', 'integration.test.ts')
        };
    }

    async run() {
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

        rl.close();
    }

    async gatherInfo() {
        this.answers.extensionName = await this.ask('Extension Name (kebab-case): ');
        this.answers.extensionDisplayName = await this.ask('Extension Display Name: ');
        this.answers.extensionDescription = await this.ask('Extension Description: ');
        this.answers.extensionPublisherID = await this.ask('Extension Publisher Identifier: ');
        this.answers.extensionAuthorFullName = await this.ask('Extension Author Full Name: ');
        this.answers.githubUsername = await this.ask('GitHub Username: ');
        this.answers.repositoryName = await this.ask('Repository Name: ');
    }

    async processFiles() {
        console.log('\n📝 Processing template files...');

        // Ensure target directories exist
        await this.ensureDirectoriesExist();

        // Process all template files
        await this.processPackageJson();
        await this.processReadme();
        await this.processChangelog();
        await this.processExtensionFile();
        await this.processTestFiles();
    }

    async ensureDirectoriesExist() {
        const directories = [
            path.join(this.rootDir, 'src'),
            path.join(this.rootDir, 'src', 'test'),
            path.join(this.rootDir, 'src', 'test', 'suite')
        ];

        directories.forEach(dir => {
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
            fs.writeFileSync(this.targetPaths.packageJson + '.template-backup', 
                fs.readFileSync(this.targetPaths.packageJson));
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
            fs.writeFileSync(this.targetPaths.readme + '.template-backup', 
                fs.readFileSync(this.targetPaths.readme));
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
            'package.json.template-backup'
        ];

        itemsToRemove.forEach(item => {
            const fullPath = path.join(this.rootDir, item);
            if (fs.existsSync(fullPath)) {
                if (fs.statSync(fullPath).isDirectory()) {
                    fs.rmSync(fullPath, { recursive: true });
                } else {
                    fs.unlinkSync(fullPath);
                }
                console.log(`  ✓ Removed ${item}`);
            }
        });
    }

    ask(question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
    new TemplateSetup().run().catch(console.error);
}

export default TemplateSetup;