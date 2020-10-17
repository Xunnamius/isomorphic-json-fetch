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

+ Default method is `POST` (unless using SWR)
+ Sugar functions for GET/POST/PUT/DELETE methods
+ `content-type` header is set to `application/json`
+ Cookies are NOT sent along with the rest of the request (configurable)
+ Request bodies can be anything serializable and will be stringified with
  `JSON.stringify`
+ Response bodies are automatically parsed with `JSON.parse`
+ `fetch()` will not reject if a non-ok response is received (configurable)
+ Simple differentiation between 2xx responses and non-2xx non-ok responses
+ Exports functions to get and set app-wide configuration
+ Sugar function for simple integration with
  [SWR](https://www.npmjs.com/package/swr)

Useful any time your project needs to consume JSON from some endpoint.

This package includes TypeScript types/generics and provides:

+ A UMD bundle (available in browsers and node via `require`, without
  [tree-shaking](https://webpack.js.org/guides/tree-shaking/) support)
+ ES2015 modules (available with ES2015 support via `import`, with [no
  side-effects tree-shaking](https://webpack.js.org/guides/tree-shaking/)
  support)

## Install

```sh
npm install isomorphic-json-fetch
```

## Quick start

```TypeScript
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
from completing. See [the unfetch
docs](https://github.com/developit/unfetch#caveats) for more information.

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
