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

• **post**: _typeof_ [_fetch_](../README.md#fetch)

## Functions

### delete

▸ **delete**<JsonType, ErrorType\>(`url`: _string_, `config?`:
[_FetchConfig_](../README.md#fetchconfig)): _Promise_<{ `error`: _undefined_ \|
ErrorType ; `json`: _undefined_ \| JsonType ; `res`: Response }\>

Syntactic sugar for calling `fetch(..., { method: 'DELETE', ... })`.

#### Type parameters:

| Name        | Type            | Default                    |
| :---------- | :-------------- | :------------------------- |
| `JsonType`  | SerializedValue | _Record_<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType                   |

#### Parameters:

| Name      | Type                                      |
| :-------- | :---------------------------------------- |
| `url`     | _string_                                  |
| `config?` | [_FetchConfig_](../README.md#fetchconfig) |

**Returns:** _Promise_<{ `error`: _undefined_ \| ErrorType ; `json`: _undefined_
\| JsonType ; `res`: Response }\>

Defined in:
[src/index.ts:161](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L161)

---

### get

▸ **get**<JsonType, ErrorType\>(`url`: _string_, `config?`:
[_FetchConfig_](../README.md#fetchconfig)): _Promise_<{ `error`: _undefined_ \|
ErrorType ; `json`: _undefined_ \| JsonType ; `res`: Response }\>

Syntactic sugar for calling `fetch(..., { method: 'GET', ... })`.

#### Type parameters:

| Name        | Type            | Default                    |
| :---------- | :-------------- | :------------------------- |
| `JsonType`  | SerializedValue | _Record_<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType                   |

#### Parameters:

| Name      | Type                                      |
| :-------- | :---------------------------------------- |
| `url`     | _string_                                  |
| `config?` | [_FetchConfig_](../README.md#fetchconfig) |

**Returns:** _Promise_<{ `error`: _undefined_ \| ErrorType ; `json`: _undefined_
\| JsonType ; `res`: Response }\>

Defined in:
[src/index.ts:139](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L139)

---

### put

▸ **put**<JsonType, ErrorType\>(`url`: _string_, `config?`:
[_FetchConfig_](../README.md#fetchconfig)): _Promise_<{ `error`: _undefined_ \|
ErrorType ; `json`: _undefined_ \| JsonType ; `res`: Response }\>

Syntactic sugar for calling `fetch(..., { method: 'PUT', ... })`.

#### Type parameters:

| Name        | Type            | Default                    |
| :---------- | :-------------- | :------------------------- |
| `JsonType`  | SerializedValue | _Record_<string, unknown\> |
| `ErrorType` | SerializedValue | JsonType                   |

#### Parameters:

| Name      | Type                                      |
| :-------- | :---------------------------------------- |
| `url`     | _string_                                  |
| `config?` | [_FetchConfig_](../README.md#fetchconfig) |

**Returns:** _Promise_<{ `error`: _undefined_ \| ErrorType ; `json`: _undefined_
\| JsonType ; `res`: Response }\>

Defined in:
[src/index.ts:150](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L150)

---

### swr

▸ **swr**(`key`: _string_): _Promise_<Record<string, unknown\>\>

#### Parameters:

| Name  | Type     |
| :---- | :------- |
| `key` | _string_ |

**Returns:** _Promise_<Record<string, unknown\>\>

Defined in:
[src/index.ts:177](https://github.com/Xunnamius/isomorphic-json-fetch/blob/6259711/src/index.ts#L177)
