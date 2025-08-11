# Auto Import  

## Description  
In previous versions like `2.x` and older, when using `Vue APIs`, it was necessary to write statements like `import { ref, ... } from 'vue'` in files.  
Now, with the evolution of `vite` and the rich ecosystem of community plugins, we can simplify the code and improve development efficiency—thanks to the plugins provided by those experts.  

::: tip Note  
When developing `*.vue`, `*.ts`, or `*.tsx` files, there is no need to manually import the following `APIs` or components:  

- All Vue APIs  
- VueRouter  
- Pinia  
- All `store` files: `./src/store/modules/*`  
- Auto-imported hooks directory: `./src/hooks/auto-imports/*`  
- All components under `./src/components/` (`*.vue` files only, no explicit import required)  
:::  

## Custom Auto Import  

Under the `./vite` directory, there are two files: `auto-import.ts` and `components.ts`, which define auto-imported **packages, functions, components**, etc.  

### Auto-Importing Packages and Functions  

In `./vite/auto-import.ts`, you can define auto-imported packages or functions, such as `vue-router`, `pinia`, `axios`, etc.  

```ts{3-8,10-14}  
export default function createAutoImport() {  
  return autoImport({  
    // Custom imports can be added here  
    imports: [  
      'vue',  
      'vue-router',  
      'pinia',  
    ],  
    dts: './types/auto-imports.d.ts',  
    // Custom function libraries or other TS files can be added here  
    dirs: [  
      './src/hooks/auto-imports/**',  
      './src/store/modules/**',  
    ],  
  })  
}  
```  

### Auto-Importing Custom Component Libraries  

In `./vite/components.ts`, you can define directories for auto-imported components. Components under `./src/components` do not require explicit imports.  

```ts{2}  
  return components({  
  dirs: ['src/components'],  
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],  
  dts: './types/components.d.ts',  
})  
```