[![npm version](https://badge.fury.io/js/isomorphic-json-fetch.svg)](https://badge.fury.io/js/isomorphic-json-fetch) [![#BlackLivesMatter!](https://img.shields.io/badge/Black%20Lives-Matter-lightgrey)](https://m4bl.org/take-action)

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

+ A UMD/CJS/AMD bundle (no tree-shaking)
+ ES2015 modules (tree-shaking)

## Install

```sh
npm install isomorphic-json-fetch
```

## Usage

```TypeScript
import { fetch } from 'isomorphic-json-fetch'

const configuration = { ... }; // This can also be set globally, see docs/
const { json: myData } = await fetch(URL, configuration);
```

See [unfetch](https://github.com/developit/unfetch#api) for possible
configuration values. Additionally, you can add `rejects: true` to your config
to cause the promise returned by `fetch()` to reject on non-2xx HTTP responses.

Or, if you're using `fetch()` across many files in a complex project:

```TypeScript
// ! src/app-main-file.ts (this file is executed first)
import { fetch, setGlobalFetchConfig } from 'isomorphic-json-fetch'

// This sets a new default configuration object for all fetch calls
setGlobalFetchConfig({
    method: 'POST', // ? POST is the default
    credentials: 'include', // ? 'same-origin' by default (i.e. no cookies sent!)
    headers: { 'Content-Type': 'application/json' }, // this is included by default
});

// Uses the new global config
const { json } = await fetch('/api/endpoint');
// ...

// ! src/some-other-file.ts
import { fetch } from 'isomorphic-json-fetch'

// Also uses the global config set in app-main-file.ts
const { json } = await fetch('/api/different-endpoint');

// You can always supersede default and global config by providing your own. The
// following example overrides the globally configured request method
const { json } = await fetch('/api/yet-another-endpoint', {
    method: 'GET',
    // `headers` and `credentials` keys were not overridden, so their values are
    // inherited from global config like normal
});
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

**Issues and pull requests are always welcome and greatly appreciated!** If you
submit a pull request, take care to maintain the existing coding style and add
unit tests for any new or changed functionality. Please lint and test your code,
of course!

Note that using the NPM run scripts to build the documentation and
distributables requires a linux-like development environment. None of the run
scripts are likely to work on non-POSIX environments. If you're on Windows, use
[WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

## Release History

* 1.0.x Initial release
