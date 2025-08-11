# Getting Started

::: tip Note
The following instructions assume that the source code has been downloaded and you have navigated to the `./web` directory in the command line.
:::

## Development Environment

You need to install the following tools locally in sequence: [Node.js](https://nodejs.org/en), [pnpm](https://pnpm.io/). Alternatively, you can use other package managers like `yarn`, but `pnpm` is recommended. The documentation assumes the use of `pnpm`.

- Node.js >= 20.0.0 (recommended: 20.x.x LTS version)
- PNPM >= 9.0.0

## Installing Dependencies and Running
Upon successful execution, the page will automatically open at the default address: http://localhost:2888.

```bash
# Install dependencies
pnpm i or pnpm install

# Run
pnpm dev
```

::: warning Dependency Installation Errors
If dependencies cannot be installed properly, it may be due to inaccessibility of the default npm registry.  
You can try executing `pnpm config set registry https://registry.npmmirror.com/` to switch to the domestic `npmmirror` registry (or use [nrm](https://github.com/Pana/nrm) for one-click registry switching).  
Then delete the `/node_modules` folder in the root directory and reinstall the dependencies.
:::