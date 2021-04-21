[![Black Lives Matter!](https://api.ergodark.com/badges/blm 'Join the movement!')](https://secure.actblue.com/donate/ms_blm_homepage_2019)
[![Maintenance status](https://img.shields.io/maintenance/active/2021 'Is this package maintained?')](https://www.npmjs.com/package/isomorphic-json-fetch)
[![Last commit timestamp](https://img.shields.io/github/last-commit/xunnamius/isomorphic-json-fetch/develop 'When was the last commit to the official repo?')](https://www.npmjs.com/package/isomorphic-json-fetch)
[![Open issues](https://img.shields.io/github/issues/xunnamius/isomorphic-json-fetch 'Number of known issues with this package')](https://www.npmjs.com/package/isomorphic-json-fetch)
[![Pull requests](https://img.shields.io/github/issues-pr/xunnamius/isomorphic-json-fetch 'Number of open pull requests')](https://www.npmjs.com/package/isomorphic-json-fetch)
[![Source license](https://img.shields.io/npm/l/isomorphic-json-fetch "This package's source license")](https://www.npmjs.com/package/isomorphic-json-fetch)
[![NPM version](https://api.ergodark.com/badges/npm-pkg-version/isomorphic-json-fetch 'Install this package using npm or yarn!')](https://www.npmjs.com/package/isomorphic-json-fetch)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# isomorphic-json-fetch 🐕

Useful any time your project needs to consume JSON from some endpoint.

This package is a small wrapper around unfetch geared specifically for fetching
JSON and sharing configuration across the application. Specifically:

- TypeScript support
- Default method is `POST` (unless using SWR)
- Sugar functions for GET/POST/PUT/DELETE methods
- `content-type` header is set to `application/json`
- Cookies are NOT sent along with the rest of the request (configurable)
- Request bodies can be anything serializable and will be stringified with
  `JSON.stringify`
- Response bodies are automatically parsed with `JSON.parse`
- `fetch()` will not reject if a non-ok response is received (configurable)
- Simple differentiation between 2xx responses and non-2xx non-ok responses
- Exports functions to get and set app-wide configuration
- Sugar function for simple integration with
  [SWR](https://www.npmjs.com/package/swr)

## Install

```bash
npm install isomorphic-json-fetch
```

## Quick start

```typeScript
import { fetch } from 'isomorphic-json-fetch'

const URL = 'api/endpoint';
let res, json, error;

// 1. With zero configuration

({ json } = await fetch(URL)); // <== json will be undefined on non-2xx responses
doSomethingWith(json.myData);

// 2. With simple error handling and typed JSON

try {
  ({ res, json } = await fetch.get<{ myData: number }>(URL));

  if(!json) return handleErr(`response code outside 200-299: ${res.status}`);
  doSomethingWith(json.myData);
}

catch(e) {
  // Could be a JSON parse error or a network issue
  handleErr(`fetch failed: ${e}`);
}

// 3. Explicitly capturing typed JSON from non-2xx responses (e.g. 404, 500)

const configuration = { // <== any configs can also be set globally, see below
  method: 'POST',
  body: { query: 'some-string' }
};

try {
  ({ json, error } = await fetch<{ myData: number }, { message: string }>(URL, configuration));

  // error is undefined on 2xx responses; json is undefined on non-2xx responses
  if(error) return handleErr(error.message);
  doSomethingWith(json.myData);
}

catch(e) {
  // Could be a JSON parse error or a network issue
  handleErr(`fetch failed: ${e}`);
}

// 4. Handling non-2xx responses as exceptions in your own catch block instead

try { doSomethingWith((await fetch.post<{ myData: number }>(URL, { rejects: true })).json.myData) }
catch(e) {
  // ! Could be a JSON parse error or a network issue OR if the
  // ! status code is not between 200-299!
  handleErr(`fetch failed: ${e}`);
}

// 5. As a quick little fetcher for SWR

const { data, error } = useSwr(URL, fetch.swr);
// Equivalent to the following:
//                ... = useSwr(URL, (url: string) => fetch(url, { swr: true }));

if(error) return <div>failed to load</div>
if(!data) return <div>loading...</div>
return <div>hello #{data.myData}!</div>

// When using SWR, it's best to set fetch configuration globally (below)
```

## Advanced usage

See [unfetch](https://github.com/developit/unfetch#api) for possible
configuration values. Additionally, you can add `rejects: true` to your config
to cause the promise returned by `fetch()` to reject on non-2xx HTTP responses.
By default, the promise returned by `fetch()` won't reject on HTTP error status
even if the response is an HTTP 404 or 500. Instead, it will resolve normally,
and it will only reject on network failure or if anything prevented the request
from completing. See
[the unfetch docs](https://github.com/developit/unfetch#caveats) for more
information.

For use with [SWR](https://www.npmjs.com/package/swr), add `swr: true` to your
config and return a higher order function manually or just use the `fetch.swr`
sugar (see example above).

If you're using `fetch()` across many files in a more complex project, you can
set a global configuration once and it will be used by all `fetch()` calls
automatically:

```TypeScript
import { fetch, setGlobalFetchConfig } from 'isomorphic-json-fetch'

const URL = 'api/endpoint';

// This sets a new default configuration object for all fetch calls
setGlobalFetchConfig({
  method: 'DELETE', // ? POST is the default
  credentials: 'include', // ? 'same-origin' by default (no cookies sent!)
  // content-type header is included by default so no need to add it yourself!
});

// All the following now use the new global config

let { json } = await fetch(URL); // <== Sends a DELETE request

// You can always override default/global config by providing your own
({ json } = await fetch(URL, { // <== Sends a PUT request
  method: 'PUT',
  // `headers` and `credentials` keys were not overridden, so their values are
  // inherited from global config like normal
}));

// This will ignore any errors thrown by `JSON.parse()`
({ json } = await fetch(URL, { method: 'GET', ignoreParseErrors: true }));

json === undefined // true

// TypeScript support for defining json return type and error return type
({ json } = await fetch.get<'technically valid JSON', { error: string }>(URL));

// Also, if you want to use the normal unfetch/node-fetch isomorphically, like
// for stream support in Node, it can be imported via `unfetch`
import { fetch, unfetch } from 'isomorphic-json-fetch'
```

Instead of passing method choice through a configuration option, this package
provides several sugar functions:

```TypeScript
import { fetch } from 'isomorphic-json-fetch'

const { json: get }  = await fetch.get('/app?t=1');
const { json: post } = await fetch.post('/app?t=2', { body: { create: true }});
const { json: put }  = await fetch.put('/app?t=3', { body: { newData: 'yes' }});
const { json: del }  = await fetch.delete('/app?t=4');
```

## Documentation

Documentation can be found under [`docs/`](docs/README.md) and can be built with
`npm run build-docs`.

## Supporting and Contributing

**New issues and pull requests are always welcome and greatly appreciated! 🤩**
But that's not the only way to contribute! Just as well, you can star 🌟 this
project to let me know you found it useful! Thank you for your support ✊🏿

This repository uses a CI/CD
[semantic-release](https://github.com/semantic-release/semantic-release#readme)
pipeline for vetting PRs and publishing releases. Be sure to
[checkout](https://git-scm.com/docs/git-checkout) the `develop` branch (_not
`main`_) and, when you're ready, fearlessly submit your PR against `develop`.
The pipeline will take care of the rest 🚀🚀🚀

### NPM Scripts

Run `npm run list-tasks` locally to see which of the following scripts are
available for this project.

> Using these scripts requires a linux-like development environment. None of the
> scripts are likely to work on non-POSIX environments. If you're on Windows,
> use [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

#### Development

- `npm run repl` to run a buffered TypeScript-Babel REPL
- `npm test` to run the unit tests and gather test coverage data
  - Look for HTML files under `coverage/`
- `npm run check-build` to run the integration tests
- `npm run check-types` to run a project-wide type check
- `npm run test-repeat` to run the entire test suite 100 times
  - Good for spotting bad async code and heisenbugs
  - Uses `__test-repeat` NPM script under the hood
- `npm run dev` to start a development server or instance
- `npm run generate` to transpile config files (under `config/`) from scratch
- `npm run regenerate` to quickly re-transpile config files (under `config/`)

#### Building

- `npm run clean` to delete all build process artifacts
- `npm run build` to compile `src/` into `dist/`, which is what makes it into
  the published package
- `npm run build-docs` to re-build the documentation
- `npm run build-externals` to compile `external-scripts/` into
  `external-scripts/bin/`
- `npm run build-stats` to gather statistics about Webpack (look for
  `bundle-stats.json`)

#### Deploying

- `npm run start` to start a production instance

#### NPX

- `npx sort-package-json` to consistently sort `package.json`
- `npx npm-force-resolutions` to forcefully patch security audit problems

## Package Details

> You don't need to read this section to use this package, everything should
> "just work"!

This is a [dual UMD (CJS2)/ES module][dual-module] package. That means this
package exposes both UMD+CJS2 and ESM entry points and can be used in most
JavaScript environments (browsers, any current or LTS Node version, etc).

Loading this package via `require(...)` will cause Node and modern browsers to
use the [CJS2 bundle][cjs2] entry point, disable [tree shaking][tree-shaking] in
Webpack 4, and lead to larger bundles in Webpack 5. Alternatively, loading this
package via `import { ... } from ...` or `import(...)` will cause Node and
modern browsers to use the ESM entry point in [versions that support
it][node-esm-support], in Webpack, and in the browser. Using the `import` syntax
is the modern, preferred choice.

For backwards compatibility with Webpack 4 and Node versions < 14,
[`package.json`](package.json) retains the [`module`][module-key] key, which
points to the ESM entry point, and the [`main`][exports-main-key] key, which
points to both the ESM and CJS2 entry points implicitly (no file extension). For
Webpack 5 and Node versions >= 14, [`package.json`](package.json) includes the
[`exports`][exports-main-key] key, which points to both entry points explicitly.

Though [`package.json`](package.json) includes
[`{ "type": "commonjs"}`][local-pkg], note that the ESM entry points are ES
module (`.mjs`) files. [`package.json`](package.json) also includes the
[`sideEffects`][side-effects-key] key, which is `false` for [optimal tree
shaking][tree-shaking], and the `types` key, which points to a TypeScript
declarations file.

> This package does not maintain shared state and so does not exhibit the [dual
> package hazard][hazard]. However, setting global configuration may not
> actually be "globally" recognized by third-party code importing this package.

[module-key]: https://webpack.js.org/guides/author-libraries/#final-steps
[side-effects-key]:
  https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
[dual-module]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#dual-commonjses-module-packages
[exports-main-key]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#package-entry-points
[hazard]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#dual-package-hazard
[cjs2]: https://webpack.js.org/configuration/output/#module-definition-systems
[tree-shaking]: https://webpack.js.org/guides/tree-shaking
[local-pkg]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[node-esm-support]:
  https://medium.com/@nodejs/node-js-version-14-available-now-8170d384567e#2368
