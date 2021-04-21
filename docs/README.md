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

Ƭ **FetchConfig**: *Omit*<RequestInit, ``"body"``\> & { `body?`: *Record*<string, unknown\> ; `ignoreParseErrors?`: *boolean* ; `rejects?`: *boolean* ; `swr?`: *boolean*  }

Defined in: [src/index.ts:6](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L6)

## Functions

### fetch

▸ **fetch**<JsonType, ErrorType\>(`url`: *string*, `config`: *Omit*<[*FetchConfig*](README.md#fetchconfig), ``"swr"``\> & { `swr`: ``true``  }): *Promise*<JsonType\>

Performs an isomorphic (un)fetch and returns the JsonType response or throws
as SWR expects.

**`example`** 
```
  const { data: json, error } = useSwr('api/endpoint', fetch.swr);
  // Or:                  ... = useSwr('api/endpoint', key => fetch(key, { swr: true }));

  if(error) <div>Error: {error.message}</div>;
  return <div>Hello, your data is: {json.data}</div>;
```

#### Type parameters:

| Name | Type | Default |
| :------ | :------ | :------ |
| `JsonType` | SerializedValue | *Record*<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `config` | *Omit*<[*FetchConfig*](README.md#fetchconfig), ``"swr"``\> & { `swr`: ``true``  } |

**Returns:** *Promise*<JsonType\>

Defined in: [src/index.ts:57](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L57)

▸ **fetch**<JsonType, ErrorType\>(`url`: *string*, `config?`: [*FetchConfig*](README.md#fetchconfig)): *Promise*<{ `error`: ErrorType \| *undefined* ; `json`: JsonType \| *undefined* ; `res`: Response  }\>

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
1) When parsing the body for JSON content fails and `{ ignoreParseErrors:
   true }`.
2) When `{ rejects: true }` or `{ swr: true }` and a non-2xx response is
   received.

#### Type parameters:

| Name | Type | Default |
| :------ | :------ | :------ |
| `JsonType` | SerializedValue | *Record*<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `config?` | [*FetchConfig*](README.md#fetchconfig) |

**Returns:** *Promise*<{ `error`: ErrorType \| *undefined* ; `json`: JsonType \| *undefined* ; `res`: Response  }\>

1) A Response object `res` and parsed response body `json`
2) `error` (`undefined` on 2xx response)

Note: `json` is undefined on non-2xx responses while `error` is undefined on
2xx responses.

Defined in: [src/index.ts:96](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L96)

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): [*FetchConfig*](README.md#fetchconfig)

Get the default config object merged in during all `fetch()` calls.

**Returns:** [*FetchConfig*](README.md#fetchconfig)

Defined in: [src/index.ts:33](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L33)

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [*FetchConfig*](README.md#fetchconfig)): *void*

Set the default config object merged in during all `fetch()` calls.

#### Parameters:

| Name | Type |
| :------ | :------ |
| `config` | [*FetchConfig*](README.md#fetchconfig) |

**Returns:** *void*

Defined in: [src/index.ts:40](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L40)

___

### unfetch

▸ `Const`**unfetch**(`input`: RequestInfo, `init?`: RequestInit): *Promise*<Response\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `input` | RequestInfo |
| `init?` | RequestInit |

**Returns:** *Promise*<Response\>

Defined in: node_modules/isomorphic-unfetch/index.d.ts:17
