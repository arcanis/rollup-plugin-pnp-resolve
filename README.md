# [Plug'n'Play](https://github.com/yarnpkg/rfcs/pull/101) resolver for Rollup

[![npm version](https://img.shields.io/npm/v/rollup-plugin-pnp-resolve.svg)](https://www.npmjs.com/package/rollup-plugin-pnp-resolve)
[![node version](https://img.shields.io/node/v/rollup-plugin-pnp-resolve.svg)](https://www.npmjs.com/package/rollup-plugin-pnp-resolve)

*This plugin is also available for [TypeScript](https://github.com/arcanis/ts-pnp), Webpack ([pnp-webpack-plugin](https://github.com/arcanis/pnp-webpack-plugin)), and Jest ([jest-pnp-resolver](https://github.com/arcanis/jest-pnp-resolver))*

## Installation

```
yarn add -D rollup-plugin-pnp-resolve
```

## Usage

Simply inject the plugin into your pipeline:

```js
const resolve = require(`rollup-plugin-pnp-resolve`);

module.exports = {
  plugins: [
    resolve(),
  ],
};
```

Don't forget that if you're using commonjs, then you also need to inject the `rollup-plugin-commonjs` plugin:

```js
const commonjs = require(`rollup-plugin-commonjs`);
const resolve = require(`rollup-plugin-pnp-resolve`);

module.exports = {
  plugins: [
    commonjs(),
    resolve(),
  ],
};
```

## License (MIT)

> **Copyright © 2016 Maël Nison**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
