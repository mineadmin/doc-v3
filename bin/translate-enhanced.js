import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import process from "process";

const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"];
const MAX_CONCURRENT = parseInt(process.env["MAX_CONCURRENT"] || "10"); // 最大并发数，可通过环境变量配置
const MAX_RETRIES = 3; // 最大重试次数
const ALL_CHANGED_FILES = process.env["ALL_CHANGED_FILES"];
const FORCE_TRANSLATE_ALL = process.env["FORCE_TRANSLATE_ALL"] === "true";
const TARGET_LANGUAGES = process.env["TARGET_LANGUAGES"] || "en,ja"; // 支持多语言，逗号分隔

// 并发控制器
class ConcurrencyController {
    constructor(maxConcurrent) {
        this.maxConcurrent = maxConcurrent;
        this.running = 0;
        this.queue = [];
    }
    
    async execute(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.running >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
        
        const { task, resolve, reject } = this.queue.shift();
        this.running++;
        
        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            // 使用 setImmediate 避免同步递归调用栈溢出
            setImmediate(() => this.processQueue());
        }
    }
}

const openai = new OpenAI({
    baseURL: endpoint,
    apiKey: token,
});

// 语言配置
const languageConfigs = {
    en: {
        name: "English",
        systemPrompt: {
            markdown: 'You are a professional translator. Translate the following Chinese markdown content to English. Keep all markdown formatting intact.',
            code: 'You are a professional translator. Translate the following Chinese code content to English. Keep all code formatting intact.'
        },
        pathReplace: { from: '/zh/', to: '/en/' }
    },
    ja: {
        name: "Japanese",
        systemPrompt: {
            markdown: 'You are a professional translator. Translate the following Chinese markdown content to Japanese. Keep all markdown formatting intact.',
            code: 'You are a professional translator. Translate the following Chinese code content to Japanese. Keep all code formatting intact.'
        },
        pathReplace: { from: '/zh/', to: '/ja/' }
    }
};

async function translateWithRetry(content, retries = 0, systemContent = '') {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: content }
            ],
            model: "deepseek-chat",
        });
        return completion.choices[0].message.content;
    } catch (error) {
        if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
            return translateWithRetry(content, retries + 1, systemContent);
        }
        throw error;
    }
}

async function processFile(srcPath, destPath, langConfig, fileIndex, totalFiles) {
    const destFolder = path.dirname(destPath);
    await mkdir(destFolder, { recursive: true });
    const content = await readFile(srcPath, 'utf8');
    
    let systemContent = langConfig.systemPrompt.markdown;
    if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
        systemContent = langConfig.systemPrompt.code;
    }
    
    const startTime = Date.now();
    const translatedContent = await translateWithRetry(content, 0, systemContent);
    const endTime = Date.now();
    
    const finalContent = translatedContent.replace(
        new RegExp(langConfig.pathReplace.from, 'g'), 
        langConfig.pathReplace.to
    );
    
    await writeFile(destPath, finalContent);
    
    const duration = (endTime - startTime) / 1000;
    console.log(`✅ [${fileIndex}/${totalFiles}] ${langConfig.name}: ${path.basename(srcPath)} (${duration.toFixed(2)}s)`);
    
    return {
        file: srcPath,
        success: true,
        duration
    };
}

async function shouldTranslateFile(file) {
    // 如果强制翻译所有文件，则返回 true
    if (FORCE_TRANSLATE_ALL) {
        return true;
    }
    
    // 如果指定了变更文件且当前文件不在列表中，跳过
    if (ALL_CHANGED_FILES && !ALL_CHANGED_FILES.includes(file)) {
        return false;
    }
    
    return true;
}

async function translateFiles(srcDir, targetLang) {
    const langConfig = languageConfigs[targetLang];
    if (!langConfig) {
        console.error(`Unsupported language: ${targetLang}`);
        return {
            success: false,
            translated: 0,
            skipped: 0,
            errors: 0
        };
    }
    
    const destDir = srcDir.replace('/zh', `/${targetLang}`);
    const concurrencyController = new ConcurrencyController(MAX_CONCURRENT);
    
    try {
        const files = await readdir(srcDir, { recursive: true });
        const translateableFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.md'));
        
        // 过滤需要翻译的文件
        const filesToTranslate = [];
        for (const file of translateableFiles) {
            if (await shouldTranslateFile(file)) {
                filesToTranslate.push(file);
            }
        }
        
        console.log(`\n🌐 Starting translation to ${langConfig.name} (${targetLang})`);
        console.log(`📁 Source: ${srcDir}`);
        console.log(`📁 Target: ${destDir}`);
        console.log(`📄 Total files: ${translateableFiles.length}`);
        console.log(`📝 Files to translate: ${filesToTranslate.length}`);
        console.log(`⚡ Max concurrency: ${MAX_CONCURRENT}`);
        
        if (FORCE_TRANSLATE_ALL) {
            console.log(`🚀 Mode: Full translation (all files)`);
        } else if (ALL_CHANGED_FILES) {
            console.log(`📝 Mode: Incremental (only changed files)`);
        }

        if (filesToTranslate.length === 0) {
            console.log(`⏭️  No files to translate for ${langConfig.name}`);
            return {
                success: true,
                translated: 0,
                skipped: translateableFiles.length,
                errors: 0
            };
        }

        const startTime = Date.now();
        let translatedCount = 0;
        let errorCount = 0;
        const results = [];
        
        // 创建所有翻译任务
        const translationPromises = filesToTranslate.map((file, index) => {
            return concurrencyController.execute(async () => {
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, file);
                
                try {
                    const result = await processFile(srcPath, destPath, langConfig, index + 1, filesToTranslate.length);
                    translatedCount++;
                    return result;
                } catch (error) {
                    errorCount++;
                    console.error(`❌ [${index + 1}/${filesToTranslate.length}] Error translating ${file}:`, error.message);
                    return {
                        file: srcPath,
                        success: false,
                        error: error.message
                    };
                }
            });
        });
        
        // 等待所有翻译任务完成
        results.push(...await Promise.all(translationPromises));
        
        const endTime = Date.now();
        const totalDuration = (endTime - startTime) / 1000;
        const avgDuration = results
            .filter(r => r.success && r.duration)
            .reduce((sum, r) => sum + r.duration, 0) / Math.max(translatedCount, 1);
        
        console.log(`\n✅ ${langConfig.name} translation completed!`);
        console.log(`📊 Statistics:`);
        console.log(`   - Translated: ${translatedCount} files`);
        console.log(`   - Skipped: ${translateableFiles.length - filesToTranslate.length} files`);
        console.log(`   - Errors: ${errorCount} files`);
        console.log(`   - Total time: ${totalDuration.toFixed(2)}s`);
        console.log(`   - Average time per file: ${avgDuration.toFixed(2)}s`);
        
        return {
            success: true,
            translated: translatedCount,
            skipped: translateableFiles.length - filesToTranslate.length,
            errors: errorCount,
            totalDuration,
            avgDuration
        };
        
    } catch (error) {
        console.error(`❌ Translation error for ${langConfig.name}:`, error);
        return {
            success: false,
            translated: 0,
            skipped: 0,
            errors: 1
        };
    }
}

async function main() {
    if (!token) {
        console.error('❌ DEEPSEEK_API_KEY environment variable is required');
        process.exit(1);
    }
    
    const targetLanguages = TARGET_LANGUAGES.split(',').map(lang => lang.trim());
    
    console.log('🚀 Enhanced Translation Tool Starting...');
    console.log(`🎯 Target Languages: ${targetLanguages.join(', ')}`);
    console.log(`⚙️  Mode: ${FORCE_TRANSLATE_ALL ? 'Full Translation' : 'Incremental Translation'}`);
    console.log(`⚡ Max Concurrency: ${MAX_CONCURRENT} parallel translations`);
    
    const overallStartTime = Date.now();
    const allResults = [];
    
    // 翻译文档
    for (const lang of targetLanguages) {
        const result = await translateFiles('docs/zh', lang);
        allResults.push({ type: 'docs', lang, ...result });
    }
    
    // 翻译配置文件
    for (const lang of targetLanguages) {
        const result = await translateFiles('.vitepress/src/zh', lang);
        allResults.push({ type: 'config', lang, ...result });
    }
    
    const overallEndTime = Date.now();
    const overallDuration = (overallEndTime - overallStartTime) / 1000;
    
    // 计算总体统计
    const totalStats = allResults.reduce((acc, result) => {
        acc.translated += result.translated;
        acc.skipped += result.skipped;
        acc.errors += result.errors;
        return acc;
    }, { translated: 0, skipped: 0, errors: 0 });
    
    console.log('\n🎉 All translations completed!');
    console.log('\n📊 Overall Statistics:');
    console.log(`   - Languages processed: ${targetLanguages.length}`);
    console.log(`   - Total files translated: ${totalStats.translated}`);
    console.log(`   - Total files skipped: ${totalStats.skipped}`);
    console.log(`   - Total errors: ${totalStats.errors}`);
    console.log(`   - Overall duration: ${overallDuration.toFixed(2)}s`);
    
    if (totalStats.translated > 0) {
        const avgTimePerFile = overallDuration / totalStats.translated;
        console.log(`   - Average time per file: ${avgTimePerFile.toFixed(2)}s`);
        console.log(`   - Estimated throughput: ${(totalStats.translated / overallDuration * 60).toFixed(1)} files/min`);
    }
    
    // 显示每种语言的详细统计
    console.log('\n📋 Detailed Results:');
    for (const result of allResults) {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${result.lang} (${result.type}): ${result.translated} translated, ${result.skipped} skipped, ${result.errors} errors`);
    }
    
    // 如果有错误，以非零状态码退出
    if (totalStats.errors > 0) {
        console.log(`\n⚠️  Translation completed with ${totalStats.errors} error(s)`);
        process.exit(1);
    }
}

// 使用示例:
// 
// 基本使用 (默认并发 10):
// node bin/translate-enhanced.js
//
// 自定义并发数:
// MAX_CONCURRENT=20 node bin/translate-enhanced.js
//
// 翻译特定语言:
// TARGET_LANGUAGES="en" node bin/translate-enhanced.js
//
// 强制翻译所有文件:
// FORCE_TRANSLATE_ALL=true node bin/translate-enhanced.js
//
// 增量翻译 (仅翻译变更文件):
// ALL_CHANGED_FILES="docs/zh/guide/start.md docs/zh/backend/index.md" node bin/translate-enhanced.js

// 运行主函数
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});