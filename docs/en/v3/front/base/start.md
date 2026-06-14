# Getting Started

::: tip Note
All the following content assumes that the source code has been downloaded and you have entered the `./web` directory in the command line.
:::

## Development Environment

Install [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/) locally in order. Other package managers like `yarn` can also be used, but `pnpm` is recommended. The documentation is based on `pnpm`.

- Node.js >= 20.0.0, LTS version 20.x.x is recommended
- PNPM >= 9.0.0

## Install Dependencies and Run
After successful execution, the page will open automatically at the default address http://localhost:2888

```bash
# Install dependencies
pnpm i or pnpm install

# Run
pnpm dev
```

::: warning Dependency Installation Error
If dependencies cannot be installed properly, it may be because the default npm registry is inaccessible.
You can try executing `pnpm config set registry https://registry.npmmirror.com/`
to switch to the domestic `npmmirror` mirror registry (or use [nrm](https://github.com/Pana/nrm) for one-click registry switching),
then delete the `/node_modules` folder in the root directory and reinstall dependencies.
:::