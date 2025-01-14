# Auto Import

## Explanation
In previous versions like `2.x` and older, when using `Vue API`, it was necessary to write statements like `import { ref, ... } from 'vue'` within the files. Now, with the evolution of `vite`, the community plugins have become very rich. Based on this, we can simplify the code and improve development efficiency, thanks to the plugins provided by those great developers.

::: tip Note
Now, when developing `*.vue`, `*.ts`, `*.tsx` files, there is no need to manually import the following `APIs` or components:

- All Vue APIs
- VueRouter
- Pinia
- All `store` files: `./src/store/modules/*`
- Auto-import directories under hooks: `./src/hooks/auto-imports/*`
- All components under `./src/components/` (only `*.vue` type files do not need explicit imports)
:::

## Custom Auto Import

In the `./vite` directory, there are two files: `auto-import.ts` and `components.ts` where you can define **packages, functions, components** for auto-import.

### Auto Import Packages and Functions

In `./vite/auto-import.ts`, you can define packages or functions for auto-import, such as `vue-router`, `pinia`, `axios`, etc.

```ts{3-8,10-14}
export default function createAutoImport() {
  return autoImport({
    // Custom imports can be defined here
    imports: [
      'vue',
      'vue-router',
      'pinia',
    ],
    dts: './types/auto-imports.d.ts',
    // Custom function libraries or other ts files can be added here
    dirs: [
      './src/hooks/auto-imports/**',
      './src/store/modules/**',
    ],
  })
}
```

### Auto Import Custom Component Libraries

In `./vite/components.ts`, you can define directories for auto-importing component libraries. Components in the `./src/components` directory do not need to be explicitly imported.

```ts{2}
  return components({
  dirs: ['src/components'],
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
  dts: './types/components.d.ts',
})
```