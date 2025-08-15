# Getting Started

::: tip Note
The following assumes the source code has been downloaded and you are in the `./web` directory via command line.
:::

## Development Environment

You need to install [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/) locally in sequence. You can also use other package managers like `yarn`, but `pnpm` is recommended. The documentation uses `pnpm` as the standard.

- Node.js >= 20.0.0, recommended LTS version 20.x.x
- PNPM >= 9.0.0

## Install Dependencies & Run
Once successfully running, the page will automatically open at the default address: http://localhost:2888

```bash
# Install dependencies
pnpm i or pnpm install

# Run
pnpm dev
```

::: warning Dependency Installation Errors
If dependencies cannot be installed normally, it may be due to inaccessibility of the default npm registry.
Try running `pnpm config set registry https://registry.npmmirror.com/` to switch to the domestic `npmmirror` mirror (or use [nrm](https://github.com/Pana/nrm) for one-click registry switching).
Then delete the `/node_modules` folder in the root directory and reinstall the dependencies.
:::