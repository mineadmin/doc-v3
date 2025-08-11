#!/usr/bin/env node
import process from "process";
import {
  TranslationService,
  TranslationOptions,
  TranslationUtils,
  LanguageConfigFactory
} from './lib/translation-core';

// 环境变量配置
const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"];
const maxConcurrent = parseInt(process.env["MAX_CONCURRENT"] || "10");
const maxRetries = 3;
const allChangedFiles = process.env["ALL_CHANGED_FILES"];
const forceTranslateAll = process.env["FORCE_TRANSLATE_ALL"] === "true";
const targetLanguagesStr = process.env["TARGET_LANGUAGES"] || "en,ja";

async function main(): Promise<void> {
  // 验证API密钥
  if (!TranslationUtils.validateApiKey(token)) {
    console.error('❌ DEEPSEEK_API_KEY environment variable is required');
    process.exit(1);
  }

  // 解析目标语言
  const targetLanguages = TranslationUtils.parseTargetLanguages(targetLanguagesStr);
  const supportedLanguages = LanguageConfigFactory.getSupportedLanguages();
  
  // 验证语言支持
  const unsupportedLanguages = targetLanguages.filter(lang => !supportedLanguages.includes(lang));
  if (unsupportedLanguages.length > 0) {
    console.error(`❌ Unsupported languages: ${unsupportedLanguages.join(', ')}`);
    console.log(`📋 Supported languages: ${supportedLanguages.join(', ')}`);
    process.exit(1);
  }

  // 配置翻译选项
  const options: TranslationOptions = {
    endpoint,
    apiKey: token || '',
    maxConcurrent,
    maxRetries,
    allChangedFiles,
    forceTranslateAll,
    targetLanguages
  };

  console.log('🚀 Enhanced Translation Tool Starting...');
  console.log(`🎯 Target Languages: ${targetLanguages.join(', ')}`);
  console.log(`⚙️  Mode: ${forceTranslateAll ? 'Full Translation' : 'Incremental Translation'}`);
  console.log(`⚡ Max Concurrency: ${maxConcurrent} parallel translations`);

  const translationService = new TranslationService(options);
  const overallStartTime = Date.now();
  const allResults: any[] = [];

  try {
    // 翻译文档
    for (const lang of targetLanguages) {
      console.log(`\n📚 Translating documentation to ${LanguageConfigFactory.getConfig(lang)?.name || lang}...`);
      const result = await translationService.translateFiles('docs/zh', lang);
      allResults.push({ type: 'docs', lang, ...result });
    }

    // 翻译配置文件
    for (const lang of targetLanguages) {
      console.log(`\n⚙️  Translating configuration to ${LanguageConfigFactory.getConfig(lang)?.name || lang}...`);
      const result = await translationService.translateFiles('.vitepress/src/zh', lang);
      allResults.push({ type: 'config', lang, ...result });
    }

    const overallEndTime = Date.now();
    const overallDuration = (overallEndTime - overallStartTime) / 1000;

    // 计算总体统计
    const totalStats = TranslationUtils.calculateOverallStats(allResults);

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
      const langName = LanguageConfigFactory.getConfig(result.lang)?.name || result.lang;
      console.log(`   ${status} ${langName} (${result.type}): ${result.translated} translated, ${result.skipped} skipped, ${result.errors} errors`);
    }

    // 如果有错误，以非零状态码退出
    if (totalStats.errors > 0) {
      console.log(`\n⚠️  Translation completed with ${totalStats.errors} error(s)`);
      process.exit(1);
    }

    console.log('\n🎉 All translations completed successfully!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// 使用示例:
// 
// 基本使用 (默认并发 10):
// pnpm run docs:translate:enhanced
//
// 自定义并发数:
// MAX_CONCURRENT=20 pnpm run docs:translate:enhanced
//
// 翻译特定语言:
// TARGET_LANGUAGES="en" pnpm run docs:translate:enhanced
//
// 强制翻译所有文件:
// FORCE_TRANSLATE_ALL=true pnpm run docs:translate:enhanced
//
// 增量翻译 (仅翻译变更文件):
// ALL_CHANGED_FILES="docs/zh/guide/start.md docs/zh/backend/index.md" pnpm run docs:translate:enhanced

// 运行主函数
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});