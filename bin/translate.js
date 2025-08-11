// 执行参数
import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import process from "node:process";
import path from "path";

process.noDeprecation = true;
const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"] || '';
const MAX_CONCURRENT = 10; // 最大并发数
const MAX_RETRIES = 3; // 最大重试次数
const CHANGE_FILES = process.env["ALL_CHANGED_FILES"]?.split('\n') ||  [];
const SOURCE_DIRS = ['docs', '.vitepress/src'];
const SOURCE_LANG = 'zh'; // 源语言

const SUPPORTED_LANGUAGES = {
    'en': {
        name: 'English',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to English. Rules: do not change markdown syntax, code fences, inline code, front-matter keys, or link targets (URLs/paths). Do not translate code blocks. Only translate human-readable text. Do not add explanations.',
            code: 'You are a professional technical translator. Translate only comments and string literals from Simplified Chinese to English. NEVER alter code tokens, identifiers, imports/exports, types, or file paths. Preserve formatting exactly. Do not add explanations.'
        }
    },
    'ja': {
        name: 'Japanese',
        systemPrompt: {
            md: 'You are a professional technical translator. Translate Simplified Chinese to Japanese. Rules: do not change markdown syntax, code fences, inline code, front-matter keys, or link targets (URLs/paths). Do not translate code blocks. Only translate human-readable text. Do not add explanations.',
            code: 'You are a professional technical translator. Translate only comments and string literals from Simplified Chinese to Japanese. NEVER alter code tokens, identifiers, imports/exports, types, or file paths. Preserve formatting exactly. Do not add explanations.'
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


// 业务函数定义开始
async function translateWithRetry(content, retries = 0,systemContent = '') {
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

async function readFiles(dir) {
    let sources = await readdir(dir, { recursive: true });
    return sources.filter(file => file.endsWith('.md') || file.endsWith('.js') || file.endsWith('.ts'));
}

function replaceZhLinks(content, lang) {
    // Markdown 链接: [text](/zh/xxx)
    content = content.replace(/(]\()\/zh\//g, `$1/${lang}/`);
    // 行内链接: (/zh/xxx)
    content = content.replace(/(\()\/zh\//g, `$1/${lang}/`);
    // HTML 属性: href="/zh/xxx" 或 to="/zh/xxx"
    content = content.replace(/(\b(?:href|to)=["'])\/zh\//g, `$1/${lang}/`);
    // JS/TS 对象属性: link: '/zh/xxx'
    content = content.replace(/(link:\s*['"])\/zh\//g, `$1${lang}/`);
    return content;
}

async function processFile(srcPath, destPath, targetLang = 'en') {
    const destFolder = path.dirname(destPath);
    await mkdir(destFolder, { recursive: true });
    const content = await readFile(srcPath, 'utf8');

    const langConfig = SUPPORTED_LANGUAGES[targetLang];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${targetLang}`);
    }

    let systemContent;
    if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
        systemContent = langConfig.systemPrompt.code;
    } else if (srcPath.endsWith('.md')) {
        systemContent = langConfig.systemPrompt.md;
    } else {
        systemContent = langConfig.systemPrompt.md; // 默认使用md提示
    }

    const translatedContent = await translateWithRetry(content, 0, systemContent);
    const finalContent = replaceZhLinks(translatedContent, targetLang);
    await writeFile(destPath, finalContent);
    console.log(`✅ Translated: ${srcPath} to ${destPath}`);
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
                console.log(`    - 🔄 Change files: ${changeInDirFiles.length}`);
                console.log(`    - 📂 Total files to translate: ${files.length}`);

                orphanFiles.map(file => {
                    console.log(`    - 🗑️ Orphan file: ${file}`);
                });

                if (files.length === 0) {
                    console.log(`    - 🟢 No files to translate for ${lang}`);
                    continue;
                }

                // 将文件分批处理
                for (let i = 0; i < files.length; i += MAX_CONCURRENT) {
                    const batch = files.slice(i, i + MAX_CONCURRENT);
                    const promises = batch.map(file => {
                        const srcPath = path.join(source_lang_dir, file);
                        const destPath = path.join(target_lang_dir, file);
                        return processFile(srcPath, destPath, lang).catch(error => {
                            console.error(`❌ translating ${file}:`, error);
                            process.exit(1);
                        });
                    });

                    await Promise.all(promises);
                }
                console.log(`✅ ${lang} translations completed!`);

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
        process.exit(1);
    }
}

await main();