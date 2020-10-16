# isomorphic-json-fetch

## Index

### Namespaces

* [unfetch](modules/unfetch.md)

### Classes

* [FetchError](classes/fetcherror.md)

### Type aliases

* [FetchConfig](README.md#fetchconfig)

### Functions

* [fetch](README.md#fetch)
* [getGlobalFetchConfig](README.md#getglobalfetchconfig)
* [setGlobalFetchConfig](README.md#setglobalfetchconfig)

## Type aliases

### FetchConfig

Ƭ  **FetchConfig**: Omit\<RequestInit, \"body\"> & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true  }

*Defined in [src/index.ts:6](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7633f88/src/index.ts#L6)*

## Functions

### fetch

▸ **fetch**\<JsonType>(`url`: RequestInfo, `config?`: [FetchConfig](README.md#fetchconfig)): Promise\<{ json: null \| JsonType ; res: Response  }>

*Defined in [src/index.ts:51](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7633f88/src/index.ts#L51)*

Performs an isomorphic (un)fetch. Throws 1) when parsing the body for JSON
content fails and `config != { ignoreParseErrors: true }` or 2) when `config
= { rejects: true }` and a non-2xx response is received.

Returns an HTTP Response object `res` and parsed response body `json`.

#### Type parameters:

Name | Type |
------ | ------ |
`JsonType` | SerializedValue |

#### Parameters:

Name | Type |
------ | ------ |
`url` | RequestInfo |
`config?` | [FetchConfig](README.md#fetchconfig) |

**Returns:** Promise\<{ json: null \| JsonType ; res: Response  }>

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true  }

*Defined in [src/index.ts:33](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7633f88/src/index.ts#L33)*

Get the default config object merged in during all fetch() calls.

**Returns:** {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true  }

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [FetchConfig](README.md#fetchconfig)): void

*Defined in [src/index.ts:40](https://github.com/Xunnamius/isomorphic-json-fetch/blob/7633f88/src/index.ts#L40)*

Set the default config object merged in during all fetch() calls.

#### Parameters:

Name | Type |
------ | ------ |
`config` | [FetchConfig](README.md#fetchconfig) |

**Returns:** void
