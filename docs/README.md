# isomorphic-json-fetch

## Index

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

Ƭ  **FetchConfig**: Omit\<RequestInit, \"body\"> & { body?: Record\<string, unknown> ; rejects?: undefined \| false \| true  }

*Defined in [src/types.ts:1](https://github.com/Xunnamius/isomorphic-json-fetch/blob/94bfbca/src/types.ts#L1)*

## Functions

### fetch

▸ **fetch**(`url`: string, `config?`: [FetchConfig](README.md#fetchconfig)): Promise\<{ json: unknown ; res: Response  }>

*Defined in [src/index.ts:45](https://github.com/Xunnamius/isomorphic-json-fetch/blob/94bfbca/src/index.ts#L45)*

Performs an isomorphic (un)fetch. Throws when parsing the body for JSON
content fails or when `config = {rejects: true}` and a non-ok response is
received.

Returns an HTTP Response object and the response body data.

#### Parameters:

Name | Type |
------ | ------ |
`url` | string |
`config?` | [FetchConfig](README.md#fetchconfig) |

**Returns:** Promise\<{ json: unknown ; res: Response  }>

___

### getGlobalFetchConfig

▸ **getGlobalFetchConfig**(): {} & { body?: Record\<string, unknown> ; rejects?: undefined \| false \| true  }

*Defined in [src/index.ts:27](https://github.com/Xunnamius/isomorphic-json-fetch/blob/94bfbca/src/index.ts#L27)*

Get the default config object merged in during all fetch() calls.

**Returns:** {} & { body?: Record\<string, unknown> ; rejects?: undefined \| false \| true  }

___

### setGlobalFetchConfig

▸ **setGlobalFetchConfig**(`config`: [FetchConfig](README.md#fetchconfig)): void

*Defined in [src/index.ts:34](https://github.com/Xunnamius/isomorphic-json-fetch/blob/94bfbca/src/index.ts#L34)*

Set the default config object merged in during all fetch() calls.

#### Parameters:

Name | Type |
------ | ------ |
`config` | [FetchConfig](README.md#fetchconfig) |

**Returns:** void
