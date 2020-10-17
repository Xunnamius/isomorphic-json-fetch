# isomorphic-json-fetch

## Index

### Namespaces

* [unfetch](modules/unfetch.md)

### Type aliases

* [FetchConfig](README.md#fetchconfig)

### Functions

* [fetch](README.md#fetch)
* [getGlobalFetchConfig](README.md#getglobalfetchconfig)
* [setGlobalFetchConfig](README.md#setglobalfetchconfig)

## Type aliases

### FetchConfig

Ƭ  **FetchConfig**: Omit\<RequestInit, \"body\"> & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true ; swr?: undefined \| false \| true  }

*Defined in [src/index.ts:5](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7e60d82/src/index.ts#L5)*

## Functions

### fetch

▸ **fetch**\<JsonType, ErrorType>(`url`: RequestInfo, `config?`: [FetchConfig](README.md#fetchconfig)): Promise\<{ error: undefined \| ErrorType ; json: undefined \| JsonType ; res: Response  }>

*Defined in [src/index.ts:64](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7e60d82/src/index.ts#L64)*

Performs an isomorphic (un)fetch.

Throws 1) when parsing the body for JSON content fails and `config != {
ignoreParseErrors: true }` or 2) when `config = { rejects: true }` and a
non-2xx response is received. Otherwise, returns an HTTP Response object
`res` and parsed response body `json` on 2xx response or `error`.

Example:
```
  const { json, error } = fetch<{ myData: number }, { message: string }>('api/endpoint', {
    method: 'POST',
    body: b
  });

  ...

  if(error) return error.message;
  return json.myData + SOME_CONST;
```

#### Type parameters:

Name | Type |
------ | ------ |
`JsonType` | SerializedValue |
`ErrorType` | SerializedValue |

#### Parameters:

Name | Type |
------ | ------ |
`url` | RequestInfo |
`config?` | [FetchConfig](README.md#fetchconfig) |

**Returns:** Promise\<{ error: undefined \| ErrorType ; json: undefined \| JsonType ; res: Response  }>

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true ; swr?: undefined \| false \| true  }

*Defined in [src/index.ts:32](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7e60d82/src/index.ts#L32)*

Get the default config object merged in during all fetch() calls.

**Returns:** {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true ; swr?: undefined \| false \| true  }

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [FetchConfig](README.md#fetchconfig)): void

*Defined in [src/index.ts:39](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7e60d82/src/index.ts#L39)*

Set the default config object merged in during all fetch() calls.

#### Parameters:

Name | Type |
------ | ------ |
`config` | [FetchConfig](README.md#fetchconfig) |

**Returns:** void
