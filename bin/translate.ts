#!/usr/bin/env node
import process from "process";
import {
  TranslationService,
  TranslationUtils,
} from './lib/translation-core';
import type { TranslationOptions } from './lib/translation-core';

// 环境变量配置
const endpoint = "https://api.deepseek.com";
const token = process.env["DEEPSEEK_API_KEY"];
const maxConcurrent = 10;
const maxRetries = 3;
const allChangedFiles = process.env["ALL_CHANGED_FILES"];

const options: TranslationOptions = {
  endpoint,
  apiKey: token || '',
  maxConcurrent,
  maxRetries,
  allChangedFiles,
  forceTranslateAll: false,
  targetLanguages: ['en', 'ja'], // 默认目标语言为英文和日文
};

async function main(): Promise<void> {
  // 验证API密钥
  if (!TranslationUtils.validateApiKey(token)) {
    console.error('❌ DEEPSEEK_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🚀 Basic Translation Tool Starting...');
  console.log('🎯 Target Language: English (en)');
  console.log(`⚡ Max Concurrency: ${maxConcurrent} parallel translations`);

  const translationService = new TranslationService(options);
  const overallStartTime = Date.now();

  try {
    // 翻译文档目录
    console.log('\n📚 Translating documentation files...');
    const docsResult = await translationService.translateFiles('docs/zh', 'en');
    
    // 翻译配置文件
    console.log('\n⚙️  Translating configuration files...');
    const configResult = await translationService.translateFiles('.vitepress/src/zh', 'en');

    const overallEndTime = Date.now();
    const overallDuration = (overallEndTime - overallStartTime) / 1000;

    // 计算总体统计
    const totalStats = TranslationUtils.calculateOverallStats([docsResult, configResult]);

    console.log('\n✅ Translation completed!');
    console.log('\n📊 Overall Statistics:');
    console.log(`   - Total files translated: ${totalStats.translated}`);
    console.log(`   - Total files skipped: ${totalStats.skipped}`);
    console.log(`   - Total errors: ${totalStats.errors}`);
    console.log(`   - Overall duration: ${overallDuration.toFixed(2)}s`);

    if (totalStats.translated > 0) {
      const avgTimePerFile = overallDuration / totalStats.translated;
      console.log(`   - Average time per file: ${avgTimePerFile.toFixed(2)}s`);
    }

    // 显示详细结果
    console.log('\n📋 Detailed Results:');
    console.log(`   📚 Documentation: ${docsResult.translated} translated, ${docsResult.skipped} skipped, ${docsResult.errors} errors`);
    console.log(`   ⚙️  Configuration: ${configResult.translated} translated, ${configResult.skipped} skipped, ${configResult.errors} errors`);

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

// 运行主函数
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});