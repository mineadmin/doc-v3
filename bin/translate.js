import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import process from "process";

const endpoint = "https://api.deepseek.com";
const token = 'sk-d6a2affa2acc4c389841daf4640384e5';
const MAX_CONCURRENT = 10; // 最大并发数
const MAX_RETRIES = 3; // 最大重试次数
const ALL_CHANGED_FILES = process.env["ALL_CHANGED_FILES"];

const openai = new OpenAI({
    baseURL: endpoint,
    apiKey: token,
});

async function translateWithRetry(content, retries = 0,systemContent = 'You are a professional translator. Translate the following Chinese markdown content to English. Keep all markdown formatting intact.') {
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
            return translateWithRetry(content, retries + 1,systemContent);
        }
        throw error;
    }
}

async function processFile(srcPath, destPath, targetLang = 'en') {
    const destFolder = path.dirname(destPath);
    await mkdir(destFolder, { recursive: true });
    const content = await readFile(srcPath, 'utf8');

    let systemContent;
    if (targetLang === 'ja') {
        if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
            systemContent = 'You are a professional translator. Translate the following Chinese code content to Japanese. Keep all code formatting intact.';
        } else if (srcPath.endsWith('.md')) {
            systemContent = 'You are a professional translator. Translate the following Chinese markdown content to Japanese. Keep all markdown formatting intact.';
        }
    } else {
        if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
            systemContent = 'You are a professional translator. Translate the following Chinese code content to English. Keep all code formatting intact.';
        } else if (srcPath.endsWith('.md')) {
            systemContent = 'You are a professional translator. Translate the following Chinese markdown content to English. Keep all markdown formatting intact.';
        }
    }

    const translatedContent = await translateWithRetry(content, 0, systemContent);
    const finalContent = translatedContent.replace(/\/zh\//g, `/${targetLang}/`);
    await writeFile(destPath, finalContent);
    console.log(`Translated: ${path.basename(srcPath)} to ${targetLang}`);
}

async function translateFiles(srcDir, destDir, targetLang = 'en') {
    try {
        const files = await readdir(srcDir, { recursive: true });
        const mdFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.md'));

        // 将文件分批处理
        for (let i = 0; i < mdFiles.length; i += MAX_CONCURRENT) {
            const batch = mdFiles.slice(i, i + MAX_CONCURRENT);
            const promises = batch.map(file => {
                // 如果指定了 ALL_CHANGED_FILES 环境变量，则只翻译发生变化的文件
                if (ALL_CHANGED_FILES && !ALL_CHANGED_FILES.includes(file)) {
                    console.log(`Skip translation for ${file}`);
                    return;
                }
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, file);
                return processFile(srcPath, destPath, targetLang).catch(error => {
                    console.error(`Error translating ${file}:`, error);
                });
            });

            await Promise.all(promises);
        }

        console.log(`All ${targetLang} translations completed!`);
    } catch (error) {
        console.error('Translation error:', error);
    }
}

// 英语翻译
translateFiles('docs/zh', 'docs/en', 'en');
translateFiles('.vitepress/src/zh', '.vitepress/src/en', 'en');

// 日语翻译
translateFiles('docs/zh', 'docs/ja', 'ja');
translateFiles('.vitepress/src/zh', '.vitepress/src/ja', 'ja');
