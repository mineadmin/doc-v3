# Getting Started

::: tip Note
The following content assumes that the source code has been downloaded and you have navigated to the `./web` directory in the command line.
:::

## Development Environment

You need to install [Node.js](https://nodejs.org/zh-cn) and [pnpm](https://pnpm.io/en/) locally in sequence. You can also use other package management tools like `yarn`, but `pnpm` is recommended. The documentation will use `pnpm` as the standard.

- Node.js >= 20.0.0, recommended LTS version 20.x.x
- PNPM >= 9.0.0

## Installing Dependencies and Running
After running successfully, the page will automatically open, with the default address being http://localhost:2888.

```bash
# Install dependencies
pnpm i or pnpm install

# Run
pnpm dev
```

::: warning Dependency Installation Errors
If you cannot install dependencies normally, it may be because the default npm registry is inaccessible.
You can try executing `pnpm config set registry https://registry.npmmirror.com/`
to switch to the domestic `npmmirror` mirror source (you can also use [nrm](https://github.com/Pana/nrm) to switch sources with one click),
then delete the `/node_modules` folder in the root directory and reinstall the dependencies.
:::