import OpenAI from "openai";
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

// 类型定义
export interface LanguageConfig {
  name: string;
  systemPrompt: {
    markdown: string;
    code: string;
  };
  pathReplace: {
    from: string;
    to: string;
  };
}

export interface TranslationOptions {
  endpoint: string;
  apiKey: string;
  maxConcurrent: number;
  maxRetries: number;
  allChangedFiles?: string;
  forceTranslateAll: boolean;
  targetLanguages: string[];
}

export interface TranslationResult {
  file: string;
  success: boolean;
  duration?: number;
  error?: string;
}

export interface TranslationStats {
  success: boolean;
  translated: number;
  skipped: number;
  errors: number;
  totalDuration?: number;
  avgDuration?: number;
}

// 并发控制器
export class ConcurrencyController {
  private running = 0;
  private queue: Array<{
    task: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  constructor(private maxConcurrent: number) {}

  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift()!;
    this.running++;

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      setImmediate(() => this.processQueue());
    }
  }
}

// 翻译API客户端
export class TranslationClient {
  private client: OpenAI;

  constructor(private options: TranslationOptions) {
    this.client = new OpenAI({
      baseURL: options.endpoint,
      apiKey: options.apiKey,
    });
  }

  async translateWithRetry(
    content: string,
    systemContent: string,
    retries = 0
  ): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: content }
        ],
        model: "deepseek-chat",
      });
      
      return completion.choices[0]?.message.content || '';
    } catch (error) {
      if (retries < this.options.maxRetries) {
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * (retries + 1))
        );
        return this.translateWithRetry(content, systemContent, retries + 1);
      }
      throw error;
    }
  }
}

// 语言配置工厂
export class LanguageConfigFactory {
  private static configs: Record<string, LanguageConfig> = {
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
    },
    ko: {
      name: "Korean",
      systemPrompt: {
        markdown: 'You are a professional translator. Translate the following Chinese markdown content to Korean. Keep all markdown formatting intact.',
        code: 'You are a professional translator. Translate the following Chinese code content to Korean. Keep all code formatting intact.'
      },
      pathReplace: { from: '/zh/', to: '/ko/' }
    },
    es: {
      name: "Spanish",
      systemPrompt: {
        markdown: 'You are a professional translator. Translate the following Chinese markdown content to Spanish. Keep all markdown formatting intact.',
        code: 'You are a professional translator. Translate the following Chinese code content to Spanish. Keep all code formatting intact.'
      },
      pathReplace: { from: '/zh/', to: '/es/' }
    },
    fr: {
      name: "French",
      systemPrompt: {
        markdown: 'You are a professional translator. Translate the following Chinese markdown content to French. Keep all markdown formatting intact.',
        code: 'You are a professional translator. Translate the following Chinese code content to French. Keep all code formatting intact.'
      },
      pathReplace: { from: '/zh/', to: '/fr/' }
    },
    de: {
      name: "German",
      systemPrompt: {
        markdown: 'You are a professional translator. Translate the following Chinese markdown content to German. Keep all markdown formatting intact.',
        code: 'You are a professional translator. Translate the following Chinese code content to German. Keep all code formatting intact.'
      },
      pathReplace: { from: '/zh/', to: '/de/' }
    },
    ru: {
      name: "Russian",
      systemPrompt: {
        markdown: 'You are a professional translator. Translate the following Chinese markdown content to Russian. Keep all markdown formatting intact.',
        code: 'You are a professional translator. Translate the following Chinese code content to Russian. Keep all code formatting intact.'
      },
      pathReplace: { from: '/zh/', to: '/ru/' }
    }
  };

  static getConfig(language: string): LanguageConfig | null {
    return this.configs[language] || null;
  }

  static getSupportedLanguages(): string[] {
    return Object.keys(this.configs);
  }

  static addLanguage(code: string, config: LanguageConfig): void {
    this.configs[code] = config;
  }
}

// 文件处理器
export class FileProcessor {
  constructor(
    private client: TranslationClient,
    public concurrencyController: ConcurrencyController,
    private options: TranslationOptions
  ) {}

  async processFile(
    srcPath: string,
    destPath: string,
    langConfig: LanguageConfig,
    fileIndex: number,
    totalFiles: number
  ): Promise<TranslationResult> {
    try {
      const destFolder = path.dirname(destPath);
      await mkdir(destFolder, { recursive: true });
      
      const content = await readFile(srcPath, 'utf8');
      
      const systemContent = this.getSystemContent(srcPath, langConfig);
      
      const startTime = Date.now();
      const translatedContent = await this.client.translateWithRetry(
        content,
        systemContent
      );
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
    } catch (error) {
      console.error(`❌ Error processing ${srcPath}:`, error);
      return {
        file: srcPath,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private getSystemContent(srcPath: string, langConfig: LanguageConfig): string {
    if (srcPath.endsWith('.ts') || srcPath.endsWith('.js')) {
      return langConfig.systemPrompt.code;
    }
    return langConfig.systemPrompt.markdown;
  }

  shouldTranslateFile(file: string): boolean {
    // 如果强制翻译所有文件
    if (this.options.forceTranslateAll) {
      return true;
    }
    
    // 如果指定了变更文件且当前文件不在列表中，跳过
    if (this.options.allChangedFiles && !this.options.allChangedFiles.includes(file)) {
      return false;
    }
    
    return true;
  }
}

// 翻译服务
export class TranslationService {
  private client: TranslationClient;
  private concurrencyController: ConcurrencyController;
  private fileProcessor: FileProcessor;

  constructor(private options: TranslationOptions) {
    this.client = new TranslationClient(options);
    this.concurrencyController = new ConcurrencyController(options.maxConcurrent);
    this.fileProcessor = new FileProcessor(
      this.client,
      this.concurrencyController,
      options
    );
  }

  async translateFiles(srcDir: string, targetLang: string): Promise<TranslationStats> {
    const langConfig = LanguageConfigFactory.getConfig(targetLang);
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

    try {
      const files = await readdir(srcDir, { recursive: true });
      const translateableFiles = files.filter(
        file => file.endsWith('.ts') || file.endsWith('.md')
      );

      // 过滤需要翻译的文件
      const filesToTranslate = translateableFiles.filter(file =>
        this.fileProcessor.shouldTranslateFile(file)
      );

      console.log(`\n🌐 Starting translation to ${langConfig.name} (${targetLang})`);
      console.log(`📁 Source: ${srcDir}`);
      console.log(`📁 Target: ${destDir}`);
      console.log(`📄 Total files: ${translateableFiles.length}`);
      console.log(`📝 Files to translate: ${filesToTranslate.length}`);
      console.log(`⚡ Max concurrency: ${this.options.maxConcurrent}`);

      if (this.options.forceTranslateAll) {
        console.log(`🚀 Mode: Full translation (all files)`);
      } else if (this.options.allChangedFiles) {
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
      const results: TranslationResult[] = [];

      // 创建所有翻译任务
      const translationPromises = filesToTranslate.map((file, index) => {
        return this.concurrencyController.execute(async () => {
          const srcPath = path.join(srcDir, file);
          const destPath = path.join(destDir, file);

          try {
            const result = await this.fileProcessor.processFile(
              srcPath,
              destPath,
              langConfig,
              index + 1,
              filesToTranslate.length
            );
            
            if (result.success) {
              translatedCount++;
            } else {
              errorCount++;
            }
            
            return result;
          } catch (error) {
            errorCount++;
            console.error(`❌ [${index + 1}/${filesToTranslate.length}] Error translating ${file}:`, 
              error instanceof Error ? error.message : String(error)
            );
            return {
              file: srcPath,
              success: false,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        });
      });

      // 等待所有翻译任务完成
      results.push(...await Promise.all(translationPromises));

      const endTime = Date.now();
      const totalDuration = (endTime - startTime) / 1000;
      const successfulResults = results.filter(r => r.success && r.duration);
      const avgDuration = successfulResults.length > 0 
        ? successfulResults.reduce((sum, r) => sum + (r.duration || 0), 0) / successfulResults.length
        : 0;

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

  async translateMultipleSources(sources: string[]): Promise<TranslationStats[]> {
    const allResults: TranslationStats[] = [];

    for (const lang of this.options.targetLanguages) {
      for (const source of sources) {
        const result = await this.translateFiles(source, lang);
        allResults.push(result);
      }
    }

    return allResults;
  }
}

// 工具函数
export class TranslationUtils {
  static validateApiKey(apiKey?: string): boolean {
    return Boolean(apiKey && apiKey.trim().length > 0);
  }

  static parseTargetLanguages(languages: string): string[] {
    return languages.split(',').map(lang => lang.trim()).filter(Boolean);
  }

  static calculateOverallStats(results: TranslationStats[]): {
    translated: number;
    skipped: number;
    errors: number;
    totalDuration: number;
  } {
    return results.reduce(
      (acc, result) => ({
        translated: acc.translated + result.translated,
        skipped: acc.skipped + result.skipped,
        errors: acc.errors + result.errors,
        totalDuration: acc.totalDuration + (result.totalDuration || 0)
      }),
      { translated: 0, skipped: 0, errors: 0, totalDuration: 0 }
    );
  }

  static logOverallResults(
    results: TranslationStats[],
    targetLanguages: string[],
    overallDuration: number
  ): void {
    const totalStats = this.calculateOverallStats(results);

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
    for (const result of results) {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} Translation: ${result.translated} translated, ${result.skipped} skipped, ${result.errors} errors`);
    }
  }
}