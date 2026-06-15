// 执行参数
import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import process from "node:process";
import path from "path";

process.noDeprecation = true;
const DEFAULT_MODEL = "gpt-4o-mini";
const SOURCE_DIRS = ['docs', '.vitepress/src'];
const SOURCE_LANG = 'zh'; // 源语言
const CHANGE_FILES = (process.env["ALL_CHANGED_FILES"] || '')
    .split('\n')
    .map(file => file.trim())
    .filter(Boolean);

const SUPPORTED_LANGUAGES = {
    'en': {
        name: 'English',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to English. IMPORTANT: Provide ONLY the translated text with no introductions, explanations, or summaries. Do not change markdown syntax, code fences, inline code, front-matter keys, or link targets. Do not translate code blocks.',
            code: 'You are a professional technical translator. Translate ONLY comments and string literals from Simplified Chinese to English. CRITICAL RULES: 1) Output raw code directly - NO markdown code blocks, NO ```typescript, NO ```javascript, NO ```. 2) Do NOT add any explanations before or after the code. 3) The first character of your response must be the first character of the translated code. 4) Preserve all formatting, whitespace, and line breaks exactly as given. 5) NEVER alter code tokens, identifiers, imports/exports, types, or file paths.'
        }
    },
    'ja': {
        name: 'Japanese',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to Japanese. IMPORTANT: Provide ONLY the translated text with no introductions, explanations, or summaries. Do not change markdown syntax, code fences, inline code, front-matter keys, or link targets. Do not translate code blocks.',
            code: 'You are a professional technical translator. Translate ONLY comments and string literals from Simplified Chinese to Japanese. CRITICAL RULES: 1) Output raw code directly - NO markdown code blocks, NO ```typescript, NO ```javascript, NO ```. 2) Do NOT add any explanations before or after the code. 3) The first character of your response must be the first character of the translated code. 4) Preserve all formatting, whitespace, and line breaks exactly as given. 5) NEVER alter code tokens, identifiers, imports/exports, types, or file paths.'
        }
    }
};

function readEnv(names) {
    for (const name of names) {
        const value = process.env[name];
        if (typeof value === 'string' && value.trim() !== '') {
            return value.trim();
        }
    }
    return '';
}

function parsePositiveInteger(names, defaultValue) {
    const rawValue = readEnv(names);
    if (!rawValue) {
        return defaultValue;
    }

    const value = Number.parseInt(rawValue, 10);
    if (!Number.isInteger(value) || value <= 0) {
        console.warn(`⚠️ Invalid ${names.join('/')}="${rawValue}", using default ${defaultValue}`);
        return defaultValue;
    }

    return value;
}

function parseBoolean(names, defaultValue = false) {
    const rawValue = readEnv(names);
    if (!rawValue) {
        return defaultValue;
    }

    if (['1', 'true', 'yes', 'on'].includes(rawValue.toLowerCase())) {
        return true;
    }

    if (['0', 'false', 'no', 'off'].includes(rawValue.toLowerCase())) {
        return false;
    }

    console.warn(`⚠️ Invalid ${names.join('/')}="${rawValue}", using default ${defaultValue}`);
    return defaultValue;
}

function parseTargetLanguages() {
    const rawValue = readEnv(['TARGET_LANGUAGES']);
    const configuredLanguages = rawValue
        ? rawValue.split(',').map(lang => lang.trim()).filter(Boolean)
        : Object.keys(SUPPORTED_LANGUAGES);

    const targetLanguages = [...new Set(configuredLanguages)];
    const unsupportedLanguages = targetLanguages.filter(lang => lang !== SOURCE_LANG && !SUPPORTED_LANGUAGES[lang]);

    if (unsupportedLanguages.length > 0) {
        throw new Error(
            `Unsupported target languages: ${unsupportedLanguages.join(', ')}. ` +
            `Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`
        );
    }

    return targetLanguages;
}

const TRANSLATION_CONFIG = {
    baseURL: readEnv(['OPENAI_BASE_URL']),
    apiKey: readEnv(['OPENAI_API_KEY']),
    model: readEnv(['OPENAI_MODEL']) || DEFAULT_MODEL,
    targetLanguages: parseTargetLanguages(),
    maxConcurrent: parsePositiveInteger(['MAX_CONCURRENT'], 15),
    maxRetries: parsePositiveInteger(['MAX_RETRIES'], 3),
    rateLimitDelay: parsePositiveInteger(['RATE_LIMIT_DELAY'], 100),
    batchDelay: parsePositiveInteger(['BATCH_DELAY'], 1000),
    forceTranslateAll: parseBoolean(['FORCE_TRANSLATE_ALL'], false),
};

if (!TRANSLATION_CONFIG.apiKey) {
    console.error("❌ Please set OPENAI_API_KEY");
    console.error("   Example:");
    console.error("   OPENAI_BASE_URL=https://api.example.com/v1 OPENAI_API_KEY=sk-xxx OPENAI_MODEL=gpt-4o-mini pnpm run docs:translate");
    process.exit(1);
}

const openaiOptions = {
    baseURL: TRANSLATION_CONFIG.baseURL,
    apiKey: TRANSLATION_CONFIG.apiKey,
};

if (!openaiOptions.baseURL) {
    delete openaiOptions.baseURL;
}

const openai = new OpenAI(openaiOptions);

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
        await new Promise(resolve => setTimeout(resolve, TRANSLATION_CONFIG.rateLimitDelay));
        
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: content }
            ],
            model: TRANSLATION_CONFIG.model,
        });
        return completion.choices[0].message.content;
    } catch (error) {
        if (retries < TRANSLATION_CONFIG.maxRetries) {
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

function cleanCodeBlockMarkers(content) {
    // 移除开头的 markdown 代码块标记 (```typescript, ```javascript, ```ts, ```js, 等)
    content = content.replace(/^```(?:typescript|javascript|ts|js|json|jsx|tsx)?\s*\n/i, '');

    // 移除结尾的 markdown 代码块标记
    content = content.replace(/\n```\s*$/, '');

    // 移除可能的额外前导/尾随空行
    content = content.trim();

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

        let translatedContent = await translateWithRetry(content, 0, systemContent, srcPath);

        // 清理代码文件中可能出现的 markdown 代码块标记
        if (systemContentType === 'code') {
            translatedContent = cleanCodeBlockMarkers(translatedContent);
        }

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
    let targetLanguages = TRANSLATION_CONFIG.targetLanguages;
    console.log(`🔌 Translation endpoint: ${TRANSLATION_CONFIG.baseURL || 'OpenAI default endpoint'}`);
    console.log(`🤖 Translation model: ${TRANSLATION_CONFIG.model}`);
    console.log(`⚙️  Max concurrent: ${TRANSLATION_CONFIG.maxConcurrent}`);
    console.log(`🌐 Target languages: ${targetLanguages.join(', ')}`);
    if (TRANSLATION_CONFIG.forceTranslateAll) {
        console.log('♻️  Force mode: translate all source files');
    }
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
                let files = TRANSLATION_CONFIG.forceTranslateAll
                    ? sourceFiles
                    : [...new Set([...changeInDirFiles, ...filesToTranslate])];

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
                const semaphore = new Array(TRANSLATION_CONFIG.maxConcurrent).fill(null);
                let semaphoreIndex = 0;

                const processBatch = async (filesBatch) => {
                    const promises = filesBatch.map(async (file) => {
                        // 获取信号量槽位
                        const slotIndex = semaphoreIndex++ % TRANSLATION_CONFIG.maxConcurrent;
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
                const BATCH_SIZE = TRANSLATION_CONFIG.maxConcurrent * 3; // 每批处理3倍并发数
                for (let i = 0; i < files.length; i += BATCH_SIZE) {
                    const batch = files.slice(i, i + BATCH_SIZE);
                    await processBatch(batch);
                    
                    // 短暂延迟以避免API限制
                    if (i + BATCH_SIZE < files.length) {
                        await new Promise(resolve => setTimeout(resolve, TRANSLATION_CONFIG.batchDelay));
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
