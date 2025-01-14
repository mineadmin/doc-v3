# Basic Concepts

The entire project has been refactored, and now we will introduce some basic concepts to help you better understand the documentation. Please make sure to read this section thoroughly first.

::: tip
Everything discussed below pertains to the structure within the `./web` directory at the root of the source code.
:::

## Global Types

Since the new version is written in `Typescript`, all global type definitions are stored in the `./types` directory. You can find the relevant data type structures there.

## Modules

The new version is divided into modules, located in the `./src/modules` directory. This directory can contain different modules, each managing its own business-related `api`, `types`, `ts`, and `view files`.

## Plugins

A new `./src/plugins` directory has been added to the frontend, specifically for storing independent applications or plugins, etc.

## Alias System
The following aliases are defined in the `vite.config.ts` file, allowing you to use aliases instead of full paths when importing files:

```json vite.config.ts
"resolve": {
    "alias": {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'),
        '$': path.resolve(__dirname, 'src/plugins'),
        '~': path.resolve(__dirname, 'src/modules'),
    },
},
```

- `@`: Represents the `./src` directory, which is generally the default alias for all frontend projects.
- `#`: Represents the `./types` directory, making it convenient to import global types.
- `$`: Represents the `./src/plugins` directory, allowing for quick and easy imports of files within plugins.
- `~`: Represents the `./src/modules` directory, allowing for quick and easy imports of files within modules.