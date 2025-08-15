import { defineConfig } from 'unocss'
import {presetWind3} from "@unocss/preset-wind3"
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [
    transformerDirectives(), // ✅ Correct
  ],
})