import unfetch from 'isomorphic-unfetch'

import type { SerializedValue } from '@ergodark/types'

export type FetchConfig = Omit<RequestInit, 'body'> & {
    swr?: boolean,
    rejects?: boolean,
    ignoreParseErrors?: boolean,
    body?: Record<string, unknown>
};

/**
 * The default `config` all fetch() calls use by default. Will be merged
 * (overridden) with the `config` object passed into each call to fetch(), if
 * provided. See [unfetch](https://github.com/developit/unfetch) for valid
 * config keys.
 */
let globalFetchConfig: FetchConfig = {
    method: 'POST',
    // credentials: 'include', // ? If you want to send and receive cookies
    headers: { 'Content-Type': 'application/json' },
};

/**
 * Re-export these
 */
export { unfetch };

/**
 * Get the default config object merged in during all fetch() calls.
 */
export function getGlobalFetchConfig() {
    return globalFetchConfig;
}

/**
 * Set the default config object merged in during all fetch() calls.
 */
export function setGlobalFetchConfig(config: FetchConfig) {
    globalFetchConfig = config;
}

/**
 * Performs an isomorphic (un)fetch.
 *
 * Throws 1) when parsing the body for JSON content fails and `config != {
 * ignoreParseErrors: true }` or 2) when `config = { rejects: true }` and a
 * non-2xx response is received. Otherwise, returns an HTTP Response object
 * `res` and parsed response body `json` on 2xx response or `error`.
 *
 * Example:
 * ```
 *   const { json, error } = fetch<{ myData: number }, { message: string }>('api/endpoint', {
 *     method: 'POST',
 *     body: b
 *   });
 *
 *   ...
 *
 *   if(error) return error.message;
 *   return json.myData + SOME_CONST;
 * ```
 */
export async function fetch<
  JsonType extends SerializedValue = Record<string, unknown>,
  ErrorType extends SerializedValue = JsonType>(
    url: RequestInfo,
    config?: FetchConfig
) {
    const parsedOptions = {
        ...getGlobalFetchConfig(),
        ...(config?.swr ? { method: 'GET' } : {}),
        ...config,
        body: config?.body !== undefined ? JSON.stringify(config.body) : undefined
    };

    const res = await unfetch(url, parsedOptions);
    let json: JsonType | undefined = undefined;
    let error: ErrorType | undefined = undefined;

    try { json = await res.json(); }
    catch(err) { if(!parsedOptions?.ignoreParseErrors) throw err; }

    if(!res.ok) {
        if(parsedOptions?.swr || parsedOptions?.rejects)
            throw json;

        error = json as ErrorType;
        json = undefined;
    }

    return { res, json, error };
}

/**
 * Syntactic sugar for calling `fetch(..., { method: 'GET', ... })`.
 */
fetch.get = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: RequestInfo,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'GET', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'PUT', ... })`.
 */
fetch.put = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: RequestInfo,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'PUT', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'DELETE', ... })`.
 */
fetch.delete = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: RequestInfo,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'DELETE', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'POST', ... })`.
 */
fetch.post = fetch;

fetch.swr = async (key: string) => (await fetch(key, { swr: true })).json;
