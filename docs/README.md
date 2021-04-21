## Table of contents

### Namespaces

- [fetch](modules/fetch.md)
- [unfetch](modules/unfetch.md)

### Type aliases

- [FetchConfig](README.md#fetchconfig)

### Functions

- [fetch](README.md#fetch)
- [getGlobalFetchConfig](README.md#getglobalfetchconfig)
- [setGlobalFetchConfig](README.md#setglobalfetchconfig)
- [unfetch](README.md#unfetch)

## Type aliases

### FetchConfig

Ƭ **FetchConfig**: _Omit_<RequestInit, `"body"`\> & { `body?`: _Record_<string,
unknown\> ; `ignoreParseErrors?`: _boolean_ ; `rejects?`: _boolean_ ; `swr?`:
_boolean_ }

Defined in:
[src/index.ts:6](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L6)

## Functions

### fetch

▸ **fetch**<JsonType, ErrorType\>(`url`: _string_, `config`:
_Omit_<[_FetchConfig_](README.md#fetchconfig), `"swr"`\> & { `swr`: `true` }):
_Promise_<JsonType\>

Performs an isomorphic (un)fetch and returns the JsonType response or throws as
SWR expects.

**`example`**

```
  const { data: json, error } = useSwr('api/endpoint', fetch.swr);
  // Or:                  ... = useSwr('api/endpoint', key => fetch(key, { swr: true }));

  if(error) <div>Error: {error.message}</div>;
  return <div>Hello, your data is: {json.data}</div>;
```

#### Type parameters:

| Name        | Type            | Default                    |
| :---------- | :-------------- | :------------------------- |
| `JsonType`  | SerializedValue | _Record_<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType                   |

#### Parameters:

| Name     | Type                                                                         |
| :------- | :--------------------------------------------------------------------------- |
| `url`    | _string_                                                                     |
| `config` | _Omit_<[_FetchConfig_](README.md#fetchconfig), `"swr"`\> & { `swr`: `true` } |

**Returns:** _Promise_<JsonType\>

Defined in:
[src/index.ts:57](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L57)

▸ **fetch**<JsonType, ErrorType\>(`url`: _string_, `config?`:
[_FetchConfig_](README.md#fetchconfig)): _Promise_<{ `error`: ErrorType \|
_undefined_ ; `json`: JsonType \| _undefined_ ; `res`: Response }\>

Performs an isomorphic (un)fetch, following redirects as necessary.

**`example`**

```
  const { json, error } = fetch.post<{ data: number }, { message: string }>(
    'api/endpoint',
    {
      headers: { key: apiKey },
      body: requestData,
      rejects: false // false is the default
    }
  );

  if(error) throw error.message;
  return json.data;
```

**`throws`**

1. When parsing the body for JSON content fails and
   `{ ignoreParseErrors: true }`.
2. When `{ rejects: true }` or `{ swr: true }` and a non-2xx response is
   received.

#### Type parameters:

| Name        | Type            | Default                    |
| :---------- | :-------------- | :------------------------- |
| `JsonType`  | SerializedValue | _Record_<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType                   |

#### Parameters:

| Name      | Type                                   |
| :-------- | :------------------------------------- |
| `url`     | _string_                               |
| `config?` | [_FetchConfig_](README.md#fetchconfig) |

**Returns:** _Promise_<{ `error`: ErrorType \| _undefined_ ; `json`: JsonType \|
_undefined_ ; `res`: Response }\>

1. A Response object `res` and parsed response body `json`
2. `error` (`undefined` on 2xx response)

Note: `json` is undefined on non-2xx responses while `error` is undefined on 2xx
responses.

Defined in:
[src/index.ts:96](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L96)

---

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): [_FetchConfig_](README.md#fetchconfig)

Get the default config object merged in during all `fetch()` calls.

**Returns:** [_FetchConfig_](README.md#fetchconfig)

Defined in:
[src/index.ts:33](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L33)

---

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [_FetchConfig_](README.md#fetchconfig)):
_void_

Set the default config object merged in during all `fetch()` calls.

#### Parameters:

| Name     | Type                                   |
| :------- | :------------------------------------- |
| `config` | [_FetchConfig_](README.md#fetchconfig) |

**Returns:** _void_

Defined in:
[src/index.ts:40](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L40)

---

### unfetch

▸ `Const`**unfetch**(`input`: RequestInfo, `init?`: RequestInit):
_Promise_<Response\>

#### Parameters:

| Name    | Type        |
| :------ | :---------- |
| `input` | RequestInfo |
| `init?` | RequestInit |

**Returns:** _Promise_<Response\>

Defined in: node_modules/isomorphic-unfetch/index.d.ts:17
