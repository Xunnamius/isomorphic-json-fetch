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

*Defined in [src/index.ts:5](https://github.com/Xunnamius/isomorphic-json-fetch/blob/bd9106c/src/index.ts#L5)*

## Functions

### fetch

▸ **fetch**\<JsonType, ErrorType>(`url`: string, `config?`: Omit\<[FetchConfig](README.md#fetchconfig), \"swr\"> & { swr: true  }): Promise\<JsonType>

*Defined in [src/index.ts:56](https://github.com/Xunnamius/isomorphic-json-fetch/blob/bd9106c/src/index.ts#L56)*

Performs an isomorphic (un)fetch and returns the JsonType response or throws
as SWR expects.

Example:
```
  const { data: json, error } = useSwr('api/endpoint', fetch.swr);
  // Or:                  ... = useSwr('api/endpoint', key => fetch(key, { swr: true }));

  if(error) <div>Error: {error.message}</div>;
  return <div>Hello, your data is: {json.data}</div>;
```

#### Type parameters:

Name | Type |
------ | ------ |
`JsonType` | SerializedValue |
`ErrorType` | SerializedValue |

#### Parameters:

Name | Type |
------ | ------ |
`url` | string |
`config?` | Omit\<[FetchConfig](README.md#fetchconfig), \"swr\"> & { swr: true  } |

**Returns:** Promise\<JsonType>

▸ **fetch**\<JsonType, ErrorType>(`url`: string, `config?`: [FetchConfig](README.md#fetchconfig)): Promise\<{ error: ErrorType \| undefined ; json: JsonType \| undefined ; res: Response  }>

*Defined in [src/index.ts:90](https://github.com/Xunnamius/isomorphic-json-fetch/blob/bd9106c/src/index.ts#L90)*

Performs an isomorphic (un)fetch.

Throws:
  1) When parsing the body for JSON content fails and `config ⊅
     {ignoreParseErrors: true }`
  2) When `config ⊇ { rejects: true }` or `config ⊇ { swr: true }` and a
     non-2xx response is received.

Otherwise, returns a Response object `res` and parsed response body as `json`
(`===undefined` on non-2xx response) or `error` (`===undefined` on 2xx
response).

Example:
```
  const { json, error } = fetch.post<{ data: number }, { message: string }>(
    'api/endpoint',
    {
      headers: { key: apiKey },
      body: requestData
    }
  );

  if(error) throw error.message;
  return json.data;
```

#### Type parameters:

Name | Type |
------ | ------ |
`JsonType` | SerializedValue |
`ErrorType` | SerializedValue |

#### Parameters:

Name | Type |
------ | ------ |
`url` | string |
`config?` | [FetchConfig](README.md#fetchconfig) |

**Returns:** Promise\<{ error: ErrorType \| undefined ; json: JsonType \| undefined ; res: Response  }>

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true ; swr?: undefined \| false \| true  }

*Defined in [src/index.ts:32](https://github.com/Xunnamius/isomorphic-json-fetch/blob/bd9106c/src/index.ts#L32)*

Get the default config object merged in during all `fetch()` calls.

**Returns:** {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true ; swr?: undefined \| false \| true  }

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [FetchConfig](README.md#fetchconfig)): void

*Defined in [src/index.ts:39](https://github.com/Xunnamius/isomorphic-json-fetch/blob/bd9106c/src/index.ts#L39)*

Set the default config object merged in during all `fetch()` calls.

#### Parameters:

Name | Type |
------ | ------ |
`config` | [FetchConfig](README.md#fetchconfig) |

**Returns:** void
