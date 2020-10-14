[![Join the movement!](https://api.ergodark.com/badges/blm)](https://m4bl.org/take-action)
[![View this project on GitHub](https://img.shields.io/maintenance/active/2020)](https://www.npmjs.com/package/isomorphic-json-fetch)
[![View this project on GitHub](https://img.shields.io/github/last-commit/xunnamius/isomorphic-json-fetch/develop)](https://www.npmjs.com/package/isomorphic-json-fetch)
[![View this project's open issues on GitHub](https://img.shields.io/github/issues/xunnamius/isomorphic-json-fetch)](https://www.npmjs.com/package/isomorphic-json-fetch)
[![View this project's open pull requests on GitHub](https://img.shields.io/github/issues-pr/xunnamius/isomorphic-json-fetch)](https://www.npmjs.com/package/isomorphic-json-fetch)
[![View the status of this project's dependencies on DavidDM](https://img.shields.io/david/xunnamius/isomorphic-json-fetch)](https://david-dm.org/xunnamius/isomorphic-json-fetch)
[![View this project on NPM](https://img.shields.io/npm/l/isomorphic-json-fetch)](https://www.npmjs.com/package/isomorphic-json-fetch)
[![View this project on NPM](https://api.ergodark.com/badges/npm-pkg-version/isomorphic-json-fetch)](https://www.npmjs.com/package/isomorphic-json-fetch)

# isomorphic-json-fetch 🐕🐕🐕

I love [unfetch](https://github.com/developit/unfetch) ~~mostly because it
reminds me of my dog~~ because it's such a lightweight no-nonsense fetch
library. This package is a small wrapper around unfetch geared specifically for
fetching JSON and sharing configuration across the application. Specifically:

+ `content-type` header is set to `application/json`
+ Default method is `POST`
+ Cookies are NOT sent along with the rest of the request (configurable)
+ Request bodies can be objects and will be stringified with `JSON.stringify`
+ Response bodies are automatically parsed with `JSON.parse`
+ `fetch()` will not reject if a non-ok response is received (configurable)
+ Exports functions to get and set app-wide configuration

Useful as a quick little fetcher for [SWR](https://www.npmjs.com/package/swr),
in React apps, or any time you need to fetch some JSON.

This package includes TypeScript types and provides:

+ A UMD bundle (available in browsers and node via `require`, without
  [tree-shaking](https://webpack.js.org/guides/tree-shaking/) support)
+ ES2015 modules (available with ES2015 support via `import`, with [no
  side-effects tree-shaking](https://webpack.js.org/guides/tree-shaking/)
  support)

## Install

```sh
npm install isomorphic-json-fetch
```

## Usage and examples

```TypeScript
import { fetch } from 'isomorphic-json-fetch'

const configuration = { ... }; // This can also be set globally; see docs/
const { json: myData } = await fetch(URL, configuration);
```

See [unfetch](https://github.com/developit/unfetch#api) for possible
configuration values. Additionally, you can add `rejects: true` to your config
to cause the promise returned by `fetch()` to reject on non-2xx HTTP responses.
By default, the promise returned by `fetch()` won't reject on HTTP error status
even if the response is an HTTP 404 or 500. Instead, it will resolve normally,
and it will only reject on network failure or if anything prevented the request
from completing. See [the unfetch
docs](https://github.com/developit/unfetch#caveats) for more information.

If you're using `fetch()` across many files in a more complex project, you can
set a global configuration once and it will be used by all `fetch()` calls
automatically:

```TypeScript
// ---! src/app-main-file.ts (this file is executed first) !---

import { fetch, setGlobalFetchConfig } from 'isomorphic-json-fetch'

// This sets a new default configuration object for all fetch calls
setGlobalFetchConfig({
    method: 'GET', // ? POST is the default
    credentials: 'include', // ? 'same-origin' by default (i.e. no cookies sent!)
    //headers: { 'Content-Type': 'application/json' }, // this is included by default so no need to add it yourself!
});

// Uses the new global config
const { json } = await fetch('/api/this-endpoint');

// ...



// ---! src/some-other-file.ts !---

import { fetch } from 'isomorphic-json-fetch'

// Also uses the global config set in app-main-file.ts
let { json } = await fetch('/api/different-endpoint');

// You can always supersede default and global config by providing your own. The
// following example overrides the globally configured request method
({ json } = await fetch('/api/yet-another-endpoint', {
    method: 'GET',
    // `headers` and `credentials` keys were not overridden, so their values are
    // inherited from global config like normal
}));

// This will ignore any errors thrown by `JSON.parse()` (`{}` is returned)
({ json } = await fetch('/api/more-endpoints', { method: 'GET', ignoreParseErrors: true }));

// This will cause fetch to throw whenever the status is not between 200-299
({ json } = await fetch('/api/and-some-more-endpoints', { method: 'GET', rejects: true }));

// If you're cool enough to be using TypeScript, you can define your return type
({ json } = await fetch<{ expected?: 'value' | 'eulav' }>('/api/that-endpoint'));
({ json } = await fetch.get<'this string is technically valid JSON too'>('/api/those-endpoints'));

// Also, if you want to use the normal unfetch/node-fetch, it can be imported
// via `unfetch`
import { fetch, unfetch } from 'isomorphic-json-fetch'
```

Instead of passing method choice through a configuration option, this package
provides several sugar functions:

```TypeScript
import { fetch } from 'isomorphic-json-fetch'

const { json: get }  = await fetch.get('/somewhere?something=1');
const { json: post } = await fetch.post('/somewhere?something=2', { body: { create: true }});
const { json: put }  = await fetch.put('/somewhere?something=3', { body: { newData: 'yes' }});
const { json: del }  = await fetch.delete('/somewhere?something=4');
```

## Documentation

Documentation can be found under [`docs/`](docs/README.md) and can be built with
`npm run build-docs`.

## Contributing

**New issues and pull requests are always welcome and greatly appreciated!** If
you submit a pull request, take care to maintain the existing coding style and
add unit tests for any new or changed functionality. Please lint and test your
code, of course!

Use `npm run build` to compile `src/` into `dist/`, which is what makes it into
the published package. Use `npm run build-docs` to re-build the documentation.
Use `npm test` to run the unit tests, `npm run check-build` to run the e2e
tests, and `check-types` to run a type check. Use `npm run list-tasks` to list
all available run scripts.

Note that using the NPM run scripts to build the documentation and
distributables requires a linux-like development environment. None of the run
scripts are likely to work on non-POSIX environments. If you're on Windows, use
[WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

This package is published using
[publish-please](https://www.npmjs.com/package/publish-please) via `npx
publish-please`.

## Release history

See [CHANGELOG.md](CHANGELOG.md).
