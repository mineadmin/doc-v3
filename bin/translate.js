import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';
import process from "process";

const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"];
const MAX_CONCURRENT = 10; // 最大并发数
const MAX_RETRIES = 3; // 最大重试次数

// 支持的语言配置
const SUPPORTED_LANGUAGES = {
    'en': {
        name: 'English',
        systemPrompt: {
            md: 'You are a professional translator. Translate the following Chinese markdown content to English. Keep all markdown formatting intact.',
            code: 'You are a professional translator. Translate the following Chinese code content to English. Keep all code formatting intact.'
        }
    },
    'ja': {
        name: 'Japanese',
        systemPrompt: {
            md: 'You are a professional translator. Translate the following Chinese markdown content to Japanese. Keep all markdown formatting intact.',
            code: 'You are a professional translator. Translate the following Chinese code content to Japanese. Keep all code formatting intact.'
        }
    }
};

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
    const finalContent = translatedContent.replace(/\/zh\//g, `/${targetLang}/`);
    await writeFile(destPath, finalContent);
    console.log(`Translated: ${path.basename(srcPath)} to ${targetLang}`);
}

/**
 * 检查文件是否存在且不为空
 */
async function fileExistsAndNotEmpty(filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.size === 0) {
            return false;
        }
        // 对于markdown文件，检查是否有实质内容
        if (filePath.endsWith('.md')) {
            const content = await readFile(filePath, 'utf8');
            const trimmedContent = content.trim();
            return trimmedContent.length > 0 && trimmedContent !== '# ';
        }
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 获取需要翻译的文件列表
 */
async function getFilesToTranslate(srcDir, destDir, targetLang, translateAll = false) {
    const files = await readdir(srcDir, { recursive: true });
    const allFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.md'));

    if (translateAll) {
        console.log(`📝 翻译模式: 全量翻译 (${allFiles.length}个文件)`);
        return allFiles;
    }

    // 智能模式：只翻译缺失或空的文件
    const filesToTranslate = [];
    const existingFiles = [];
    const emptyFiles = [];

    for (const file of allFiles) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        const exists = await fileExistsAndNotEmpty(destPath);
        if (!exists) {
            const fileExists = await stat(destPath).then(() => true).catch(() => false);
            if (fileExists) {
                emptyFiles.push(file);
            }
            filesToTranslate.push(file);
        } else {
            existingFiles.push(file);
        }
    }

    console.log(`📝 翻译模式: 智能增量翻译`);
    console.log(`   📄 总文件: ${allFiles.length}个`);
    console.log(`   ✅ 已存在: ${existingFiles.length}个`);
    console.log(`   ❌ 缺失/空: ${filesToTranslate.length}个`);
    if (emptyFiles.length > 0) {
        console.log(`   ⚠️  空文件: ${emptyFiles.length}个`);
    }

    return filesToTranslate;
}

/**
 * 检查翻译状态（只检测不翻译）
 */
async function checkTranslationStatus(srcDir, destDir, targetLang) {
    try {
        const files = await readdir(srcDir, { recursive: true });
        const allFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.md'));

        const missingFiles = [];
        const emptyFiles = [];
        const existingFiles = [];

        console.log(`\n🔍 检查 ${targetLang.toUpperCase()} 翻译状态 (${srcDir} -> ${destDir})...`);

        for (const file of allFiles) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);

            const exists = await fileExistsAndNotEmpty(destPath);
            if (!exists) {
                const fileExists = await stat(destPath).then(() => true).catch(() => false);
                if (fileExists) {
                    emptyFiles.push(file);
                } else {
                    missingFiles.push(file);
                }
            } else {
                existingFiles.push(file);
            }
        }

        const totalFiles = allFiles.length;
        const translatedCount = existingFiles.length;
        const completionRate = totalFiles > 0 ? ((translatedCount / totalFiles) * 100).toFixed(2) : 100;

        console.log(`📊 翻译状态统计:`);
        console.log(`   📄 总文件数: ${totalFiles}`);
        console.log(`   ✅ 已翻译: ${translatedCount} (${completionRate}%)`);
        console.log(`   ❌ 缺失文件: ${missingFiles.length}`);
        console.log(`   ⚠️  空文件: ${emptyFiles.length}`);

        if (missingFiles.length > 0) {
            console.log(`\n❌ 缺失的文件:`);
            missingFiles.forEach(file => console.log(`   - ${file}`));
        }

        if (emptyFiles.length > 0) {
            console.log(`\n⚠️  空文件:`);
            emptyFiles.forEach(file => console.log(`   - ${file}`));
        }

        return {
            total: totalFiles,
            translated: translatedCount,
            missing: missingFiles.length,
            empty: emptyFiles.length,
            completionRate: parseFloat(completionRate),
            missingFiles,
            emptyFiles,
            complete: missingFiles.length === 0 && emptyFiles.length === 0
        };
    } catch (error) {
        console.warn(`⚠️  无法访问源目录 ${srcDir}: ${error.message}`);
        return {
            total: 0,
            translated: 0,
            missing: 0,
            empty: 0,
            completionRate: 100,
            missingFiles: [],
            emptyFiles: [],
            complete: true,
            error: error.message
        };
    }
}

async function translateFiles(srcDir, destDir, targetLang = 'en', translateAll = false) {
    try {
        const filesToTranslate = await getFilesToTranslate(srcDir, destDir, targetLang, translateAll);

        if (filesToTranslate.length === 0) {
            console.log(`✅ ${targetLang.toUpperCase()} 翻译已是最新，无需翻译`);
            return;
        }

        console.log(`🚀 开始翻译 ${filesToTranslate.length} 个文件到 ${targetLang.toUpperCase()}...`);

        // 将文件分批处理
        for (let i = 0; i < filesToTranslate.length; i += MAX_CONCURRENT) {
            const batch = filesToTranslate.slice(i, i + MAX_CONCURRENT);
            const promises = batch.map(file => {
                const srcPath = path.join(srcDir, file);
                const destPath = path.join(destDir, file);
                return processFile(srcPath, destPath, targetLang).catch(error => {
                    console.error(`Error translating ${file}:`, error);
                });
            });

            await Promise.all(promises);
        }

        console.log(`✅ ${targetLang.toUpperCase()} 翻译完成! (${filesToTranslate.length}个文件)`);
    } catch (error) {
        console.error('Translation error:', error);
    }
}

/**
 * 解析命令行参数
 */
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        languages: [], // 要翻译的语言列表
        help: false,
        translateAll: false, // 是否翻译所有文件
        checkOnly: false // 只检测不翻译
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--language':
            case '-l':
                if (i + 1 < args.length) {
                    const lang = args[i + 1];
                    if (SUPPORTED_LANGUAGES[lang]) {
                        options.languages.push(lang);
                        i++; // 跳过下一个参数
                    } else {
                        console.error(`❌ 不支持的语言: ${lang}`);
                        console.error(`支持的语言: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`);
                        process.exit(1);
                    }
                } else {
                    console.error('❌ --language 参数需要指定语言代码');
                    process.exit(1);
                }
                break;

            case '--all':
            case '-a':
                options.translateAll = true;
                break;

            case '--check':
            case '-c':
                options.checkOnly = true;
                break;

            case '--help':
            case '-h':
                options.help = true;
                break;

            default:
                // 直接指定语言代码
                if (SUPPORTED_LANGUAGES[arg]) {
                    options.languages.push(arg);
                } else {
                    console.error(`❌ 未知参数或不支持的语言: ${arg}`);
                    process.exit(1);
                }
        }
    }

    return options;
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log('🌐 AI翻译工具');
    console.log('');
    console.log('用法:');
    console.log('  node bin/translate.js [选项] [语言代码...]');
    console.log('');
    console.log('选项:');
    console.log('  -l, --language <lang>    指定要翻译的语言');
    console.log('  -a, --all               翻译所有文件(默认只翻译缺失的文件)');
    console.log('  -c, --check             只检查翻译状态，不执行翻译');
    console.log('  -h, --help              显示帮助信息');
    console.log('');
    console.log('支持的语言:');
    Object.entries(SUPPORTED_LANGUAGES).forEach(([code, config]) => {
        console.log(`  ${code.padEnd(4)} ${config.name}`);
    });
    console.log('');
    console.log('模式说明:');
    console.log('  默认模式: 智能增量翻译，只翻译缺失或空的文件');
    console.log('  --all:   全量翻译，重新翻译所有文件');
    console.log('  --check: 只检查翻译状态，生成报告但不执行翻译');
    console.log('');
    console.log('示例:');
    console.log('  pnpm run docs:translate en               # 智能翻译英文(只翻译缺失文件)');
    console.log('  pnpm run docs:translate en --all         # 全量翻译英文');
    console.log('  pnpm run docs:translate en --check       # 检查英文翻译状态');
    console.log('  pnpm run docs:translate --check          # 检查所有语言翻译状态');
    console.log('  pnpm run docs:translate                  # 智能翻译所有语言');
}

/**
 * 执行检查任务
 */
async function executeCheck(languages) {
    console.log(`🔍 开始检查翻译状态...`);
    console.log(`📝 检查语言: ${languages.map(lang => SUPPORTED_LANGUAGES[lang].name).join(', ')}`);

    const results = [];

    for (const lang of languages) {
        console.log(`\n🔄 检查 ${SUPPORTED_LANGUAGES[lang].name} (${lang})...`);

        // 检查文档文件
        const docsResult = await checkTranslationStatus('docs/zh', `docs/${lang}`, lang);

        // 检查VitePress配置文件
        const vitepressResult = await checkTranslationStatus('.vitepress/src/zh', `.vitepress/src/${lang}`, lang);

        const totalResult = {
            language: lang,
            name: SUPPORTED_LANGUAGES[lang].name,
            docs: docsResult,
            vitepress: vitepressResult,
            overall: {
                total: docsResult.total + vitepressResult.total,
                translated: docsResult.translated + vitepressResult.translated,
                missing: docsResult.missing + vitepressResult.missing,
                empty: docsResult.empty + vitepressResult.empty,
                complete: docsResult.complete && vitepressResult.complete
            }
        };

        totalResult.overall.completionRate = totalResult.overall.total > 0
            ? ((totalResult.overall.translated / totalResult.overall.total) * 100).toFixed(2)
            : 100;

        results.push(totalResult);

        console.log(`📋 ${lang.toUpperCase()} 总体状态: ${totalResult.overall.completionRate}% 完成`);
    }

    // 生成汇总报告
    console.log(`\n📊 翻译状态汇总报告:`);
    console.log('='.repeat(60));

    const completeLanguages = results.filter(r => r.overall.complete);
    const incompleteLanguages = results.filter(r => !r.overall.complete);

    if (completeLanguages.length > 0) {
        console.log(`✅ 完整翻译 (${completeLanguages.length}): ${completeLanguages.map(r => r.language.toUpperCase()).join(', ')}`);
    }

    if (incompleteLanguages.length > 0) {
        console.log(`⚠️  不完整翻译 (${incompleteLanguages.length}):`);
        incompleteLanguages.forEach(r => {
            console.log(`   - ${r.language.toUpperCase()}: ${r.overall.completionRate}% (缺失: ${r.overall.missing + r.overall.empty}个文件)`);
        });

        console.log(`\n💡 建议操作:`);
        incompleteLanguages.forEach(r => {
            if (r.overall.missing > 0 || r.overall.empty > 0) {
                console.log(`   - 翻译 ${r.language.toUpperCase()}: pnpm docs:translate ${r.language}`);
            }
        });
    }

    return results;
}

/**
 * 执行翻译任务
 */
async function executeTranslation(languages, translateAll = false) {
    console.log(`🚀 开始翻译任务...`);
    console.log(`📝 目标语言: ${languages.map(lang => SUPPORTED_LANGUAGES[lang].name).join(', ')}`);
    console.log(`🔧 翻译模式: ${translateAll ? '全量翻译' : '智能增量翻译'}`);

    for (const lang of languages) {
        console.log(`\n🔄 开始翻译 ${SUPPORTED_LANGUAGES[lang].name} (${lang})...`);

        // 翻译文档文件
        await translateFiles('docs/zh', `docs/${lang}`, lang, translateAll);

        // 翻译VitePress配置文件
        await translateFiles('.vitepress/src/zh', `.vitepress/src/${lang}`, lang, translateAll);

        console.log(`✅ ${SUPPORTED_LANGUAGES[lang].name} 翻译完成!`);
    }

    console.log(`\n🎉 所有翻译任务完成!`);
}

/**
 * 主函数
 */
async function main() {
    try {
        const options = parseArguments();

        if (options.help) {
            showHelp();
            return;
        }

        // 如果没有指定语言，默认处理所有语言
        const targetLanguages = options.languages.length > 0
            ? options.languages
            : Object.keys(SUPPORTED_LANGUAGES);

        if (options.checkOnly) {
            // 只检查模式
            const results = await executeCheck(targetLanguages);

            // 如果有不完整的翻译，设置退出码
            const hasIncomplete = results.some(r => !r.overall.complete);
            if (hasIncomplete) {
                process.exit(0);
            }
        } else {
            // 翻译模式
            await executeTranslation(targetLanguages, options.translateAll);
        }

    } catch (error) {
        console.error('❌ 处理过程中发生错误:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本，执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
