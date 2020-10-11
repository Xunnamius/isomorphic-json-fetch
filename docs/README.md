**[isomorphic-json-fetch](README.md)**

> Globals

# isomorphic-json-fetch

## Index

### Namespaces

* [unfetch](modules/unfetch.md)

### Classes

* [FetchError](classes/fetcherror.md)

### Functions

* [fetch](README.md#fetch)
* [getGlobalFetchConfig](README.md#getglobalfetchconfig)
* [setGlobalFetchConfig](README.md#setglobalfetchconfig)

## Functions

### fetch

▸ **fetch**\<JsonType>(`url`: string, `config?`: *typeof* globalFetchConfig): Promise\<{ json: null \| JsonType ; res: Response  }>

*Defined in [src/index.ts:49](https://github.com/Xunnamius/isomorphic-json-fetch/blob/b652b36/src/index.ts#L49)*

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
`url` | string |
`config?` | *typeof* globalFetchConfig |

**Returns:** Promise\<{ json: null \| JsonType ; res: Response  }>

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true  }

*Defined in [src/index.ts:31](https://github.com/Xunnamius/isomorphic-json-fetch/blob/b652b36/src/index.ts#L31)*

Get the default config object merged in during all fetch() calls.

**Returns:** {} & { body?: Record\<string, unknown> ; ignoreParseErrors?: undefined \| false \| true ; rejects?: undefined \| false \| true  }

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: *typeof* globalFetchConfig): void

*Defined in [src/index.ts:38](https://github.com/Xunnamius/isomorphic-json-fetch/blob/b652b36/src/index.ts#L38)*

Set the default config object merged in during all fetch() calls.

#### Parameters:

Name | Type |
------ | ------ |
`config` | *typeof* globalFetchConfig |

**Returns:** void
