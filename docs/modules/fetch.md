[isomorphic-json-fetch](../README.md) / fetch

# Namespace: fetch

## Table of contents

### Variables

- [post](fetch.md#post)

### Functions

- [delete](fetch.md#delete)
- [get](fetch.md#get)
- [put](fetch.md#put)
- [swr](fetch.md#swr)

## Variables

### post

• **post**: *typeof* [*fetch*](../README.md#fetch)

## Functions

### delete

▸ **delete**<JsonType, ErrorType\>(`url`: *string*, `config?`: [*FetchConfig*](../README.md#fetchconfig)): *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Syntactic sugar for calling `fetch(..., { method: 'DELETE', ... })`.

#### Type parameters:

| Name | Type | Default |
| :------ | :------ | :------ |
| `JsonType` | SerializedValue | *Record*<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `config?` | [*FetchConfig*](../README.md#fetchconfig) |

**Returns:** *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Defined in: [src/index.ts:161](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L161)

___

### get

▸ **get**<JsonType, ErrorType\>(`url`: *string*, `config?`: [*FetchConfig*](../README.md#fetchconfig)): *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Syntactic sugar for calling `fetch(..., { method: 'GET', ... })`.

#### Type parameters:

| Name | Type | Default |
| :------ | :------ | :------ |
| `JsonType` | SerializedValue | *Record*<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `config?` | [*FetchConfig*](../README.md#fetchconfig) |

**Returns:** *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Defined in: [src/index.ts:139](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L139)

___

### put

▸ **put**<JsonType, ErrorType\>(`url`: *string*, `config?`: [*FetchConfig*](../README.md#fetchconfig)): *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Syntactic sugar for calling `fetch(..., { method: 'PUT', ... })`.

#### Type parameters:

| Name | Type | Default |
| :------ | :------ | :------ |
| `JsonType` | SerializedValue | *Record*<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `url` | *string* |
| `config?` | [*FetchConfig*](../README.md#fetchconfig) |

**Returns:** *Promise*<{ `error`: *undefined* \| ErrorType ; `json`: *undefined* \| JsonType ; `res`: Response  }\>

Defined in: [src/index.ts:150](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L150)

___

### swr

▸ **swr**(`key`: *string*): *Promise*<Record<string, unknown\>\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `key` | *string* |

**Returns:** *Promise*<Record<string, unknown\>\>

Defined in: [src/index.ts:177](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L177)
