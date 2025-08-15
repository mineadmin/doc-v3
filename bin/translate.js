// 执行参数
import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import process from "node:process";
import path from "path";

process.noDeprecation = true;
const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"] || '';
const MAX_CONCURRENT = 15; // 增加并发数
const MAX_RETRIES = 3; // 最大重试次数
const RATE_LIMIT_DELAY = 100; // API调用间隔(毫秒)
const BATCH_DELAY = 1000; // 批次间延迟(毫秒)
const CHANGE_FILES = process.env["ALL_CHANGED_FILES"]?.split('\n') ||  [];
const SOURCE_DIRS = ['docs', '.vitepress/src'];
const SOURCE_LANG = 'zh'; // 源语言

const SUPPORTED_LANGUAGES = {
    'en': {
        name: 'English',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to English. IMPORTANT: Provide ONLY the translated text with no introductions, explanations, or summaries. Do not change markdown syntax, code fences, inline code, front-matter keys, or link targets. Do not translate code blocks.',
            code: 'You are a professional technical translator. Translate ONLY comments and string literals from Simplified Chinese to English. IMPORTANT: This is a JS or TS file. You are not allowed to add anything to the original text. Provide ONLY the translated code with no introductions or summaries. NEVER alter code tokens, identifiers, imports/exports, types, or file paths. Preserve formatting exactly.'
        }
    },
    'ja': {
        name: 'Japanese',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to Japanese. IMPORTANT: Provide ONLY the translated text with no introductions, explanations, or summaries. Do not change markdown syntax, code fences, inline code, front-matter keys, or link targets. Do not translate code blocks.',
            code: 'You are a professional technical translator. Translate ONLY comments and string literals from Simplified Chinese to Japanese. IMPORTANT: This is a JS or TS file. You are not allowed to add anything to the original text. Provide ONLY the translated code with no introductions or summaries. NEVER alter code tokens, identifiers, imports/exports, types, or file paths. Preserve formatting exactly.'
        }
    }
};

if (!token) {
    console.error("❌ Please set the environment variable DEEPSEEK_API_KEY");
    process.exit(1);
}

const openai = new OpenAI({
    baseURL: endpoint,
    apiKey: token,
});

// 进度跟踪器
class ProgressTracker {
    constructor(total) {
        this.total = total;
        this.completed = 0;
        this.failed = 0;
        this.startTime = Date.now();
    }

    update(success = true) {
        if (success) {
            this.completed++;
        } else {
            this.failed++;
        }
        this.showProgress();
    }

    showProgress() {
        const processed = this.completed + this.failed;
        const percentage = Math.round((processed / this.total) * 100);
        const elapsed = Math.round((Date.now() - this.startTime) / 1000);
        const rate = processed / elapsed;
        const eta = rate > 0 ? Math.round((this.total - processed) / rate) : 0;
        
        process.stdout.write(`\r    📊 Progress: ${processed}/${this.total} (${percentage}%) | ✅ ${this.completed} | ❌ ${this.failed} | ⏱️ ${elapsed}s | ETA: ${eta}s`);
        
        if (processed === this.total) {
            console.log(`\n    🎉 Translation batch completed: ${this.completed} succeeded, ${this.failed} failed`);
        }
    }
}

// 业务函数定义开始
async function translateWithRetry(content, retries = 0, systemContent = '', filePath = '') {
    try {
        // 添加轻量级的速率限制
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        
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
            const backoffDelay = 1000 * Math.pow(2, retries); // 指数退避
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return translateWithRetry(content, retries + 1, systemContent, filePath);
        }
        console.error(`\n❌ Translation failed for ${filePath}: ${error.message}`);
        throw error;
    }
}

async function readFiles(dir) {
    let sources = await readdir(dir, { recursive: true });
    return sources.filter(file => file.endsWith('.md') || file.endsWith('.js') || file.endsWith('.ts'));
}

function replaceZhLinks(content, lang, type = 'md') {
    if (type === 'md') {
        // Markdown 链接: [text](/zh/xxx)
        content = content.replace(/(]\()\/zh\//g, `$1/${lang}/`);
        // 行内链接: (/zh/xxx)
        content = content.replace(/(\()\/zh\//g, `$1/${lang}/`);
        // HTML 属性: href="/zh/xxx" 或 to="/zh/xxx"
        content = content.replace(/(\b(?:href|to)=["'])\/zh\//g, `$1/${lang}/`);
    } else if (type === 'code') {
        // JS/TS 对象属性: link: '/zh/xxx'
        content = content.replace(/(link:\s*['"])\/zh\//g, `$1/${lang}/`);
        // JS/TS 对象键: '/zh/xxx':
        content = content.replace(/(['"])\/zh\/(.*?['"]\s*:)/g, `$1/${lang}/$2`);
    }
    return content;
}

async function processFile(srcPath, destPath, targetLang = 'en', progressTracker = null) {
    try {
        const destFolder = path.dirname(destPath);
        await mkdir(destFolder, { recursive: true });
        const content = await readFile(srcPath, 'utf8');

        const langConfig = SUPPORTED_LANGUAGES[targetLang];
        if (!langConfig) {
            throw new Error(`Unsupported language: ${targetLang}`);
        }

        let systemContentType = 'md';
        let systemContent;
        if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
            systemContentType = 'code'
            systemContent = langConfig.systemPrompt.code;
        } else if (srcPath.endsWith('.md')) {
            systemContent = langConfig.systemPrompt.md;
        } else {
            systemContent = langConfig.systemPrompt.md; // 默认使用md提示
        }

        const translatedContent = await translateWithRetry(content, 0, systemContent, srcPath);
        const finalContent = replaceZhLinks(translatedContent, targetLang, systemContentType);
        await writeFile(destPath, finalContent);
        
        if (progressTracker) {
            progressTracker.update(true);
        }
        
        return { success: true, srcPath, destPath };
    } catch (error) {
        if (progressTracker) {
            progressTracker.update(false);
        }
        return { success: false, srcPath, destPath, error: error.message };
    }
}


async function handle() {
    // 先扫描zh目录，获取所有需要处理的文件
    let targetLanguages = Object.keys(SUPPORTED_LANGUAGES);
    console.log(`🌐 Supported languages: ${targetLanguages.join(', ')}`);
    console.log('----------------------------------------');
    for (const dir of SOURCE_DIRS) {
        let source_lang_dir = `${dir}/${SOURCE_LANG}`;
        let sourceFiles;

        // 筛选出pr change files 在当前目录中
        let changeInDirFiles = CHANGE_FILES
            .filter(file => file.startsWith(source_lang_dir))
            .map(file => file.replace(`${source_lang_dir}/`, ''));
        console.log(`\n📁 Directory: ${dir}`);
        try {
            sourceFiles = await readFiles(source_lang_dir);
            console.log(`  - ✅ Found ${sourceFiles.length} source files in ${source_lang_dir}`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`  - 🟡 Source directory not found: ${source_lang_dir}`);
                continue;
            }
            throw error;
        }

        for (const lang of targetLanguages) {
            if (lang === SOURCE_LANG) continue;
            let target_lang_dir = `${dir}/${lang}`;
            console.log(`  - 🌍 Language: ${lang}`);
            try {
                await mkdir(target_lang_dir, { recursive: true });
                let targetFiles = await readFiles(target_lang_dir);
                let filesToTranslate = sourceFiles.filter(file => !targetFiles.includes(file));
                let orphanFiles = targetFiles.filter(file => !sourceFiles.includes(file));

                // 合并 filesToTranslate 和 changeInDirFiles
                let files = [...new Set([...changeInDirFiles, ...filesToTranslate])];

                console.log(`    - 📝 Untranslated files: ${filesToTranslate.length}`);
                console.log(`    - 🗑️ Orphan files: ${orphanFiles.length}`);
                orphanFiles.map(file => {
                    console.log(`        - 🗑️ Orphan file (no source): ${path.join(target_lang_dir, file)}`);
                })
                console.log(`    - 🔄 Change files: ${changeInDirFiles.length}`);
                if (files.length === 0) {
                    console.log(`    - 🟢 No files to translate for ${lang}`);
                    continue;
                } else {
                    console.log(`    - 📂 Total files to translate: ${files.length}`);
                }

                // 创建进度跟踪器
                const progressTracker = new ProgressTracker(files.length);
                const failedFiles = [];

                // 并行处理所有文件，但使用信号量控制并发
                const semaphore = new Array(MAX_CONCURRENT).fill(null);
                let semaphoreIndex = 0;

                const processBatch = async (filesBatch) => {
                    const promises = filesBatch.map(async (file) => {
                        // 获取信号量槽位
                        const slotIndex = semaphoreIndex++ % MAX_CONCURRENT;
                        await semaphore[slotIndex];
                        
                        const srcPath = path.join(source_lang_dir, file);
                        const destPath = path.join(target_lang_dir, file);
                        
                        // 设置信号量为Promise，下一个任务将等待
                        semaphore[slotIndex] = processFile(srcPath, destPath, lang, progressTracker)
                            .then(result => {
                                if (!result.success) {
                                    failedFiles.push({ file, error: result.error });
                                }
                                return result;
                            });
                        
                        return semaphore[slotIndex];
                    });

                    return Promise.all(promises);
                };

                // 分批处理以避免内存过载
                const BATCH_SIZE = MAX_CONCURRENT * 3; // 每批处理3倍并发数
                for (let i = 0; i < files.length; i += BATCH_SIZE) {
                    const batch = files.slice(i, i + BATCH_SIZE);
                    await processBatch(batch);
                    
                    // 短暂延迟以避免API限制
                    if (i + BATCH_SIZE < files.length) {
                        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                    }
                }

                // 等待所有信号量完成
                await Promise.all(semaphore);

                console.log(`\n    ✅ ${lang} translation completed!`);
                if (failedFiles.length > 0) {
                    console.log(`    ❌ Failed files (${failedFiles.length}):`);
                    failedFiles.forEach(({ file, error }) => {
                        console.log(`      - ${file}: ${error}`);
                    });
                }

            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`    - 🟡 Target directory not found: ${target_lang_dir}`);
                } else {
                    throw error;
                }
            }
        }
        console.log('----------------------------------------');
    }
    console.log(`\n🎉 All translations completed!`);
}

async function main() {
    try {
        await handle();
    } catch (error) {
        console.error('❌ Error:', error.message);
        // 打印更详细的错误信息
        if (error.response) {
            console.error('Detailed Error Information:', JSON.stringify(error.response.data, null, 2));
        } else if (error.cause) {
            console.error('Error Cause:', error.cause);
        }
        // 打印完整错误堆栈
        console.error('Error Stack:', error.stack);
        process.exit(1);
    }
}

await main();