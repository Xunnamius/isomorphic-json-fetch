import unfetch from 'isomorphic-unfetch'
import { FetchError } from 'named-app-errors'

import type { SerializedValue } from '@ergodark/types'

/**
 * The default `config` all fetch() calls use by default. Will be merged
 * (overridden) with the `config` object passed into each call to fetch(), if
 * provided. See [unfetch](https://github.com/developit/unfetch) for valid
 * config keys.
 */
let globalFetchConfig: Omit<RequestInit, 'body'> & {
    rejects?: boolean,
    ignoreParseErrors?: boolean,
    body?: Record<string, unknown>
} = {
    method: 'POST',
    // credentials: 'include', // ? If you want to send and receive cookies
    headers: { 'Content-Type': 'application/json' },
};

/**
 * Re-export these
 */
export { FetchError };

/**
 * Get the default config object merged in during all fetch() calls.
 */
export function getGlobalFetchConfig() {
    return globalFetchConfig;
}

/**
 * Set the default config object merged in during all fetch() calls.
 */
export function setGlobalFetchConfig(config: typeof globalFetchConfig) {
    globalFetchConfig = config;
}

/**
 * Performs an isomorphic (un)fetch. Throws 1) when parsing the body for JSON
 * content fails and `config != { ignoreParseErrors: true }` or 2) when `config
 * = { rejects: true }` and a non-2xx response is received.
 *
 * Returns an HTTP Response object `res` and parsed response body `json`.
 */
export async function fetch<JsonType extends SerializedValue>(url: string, config?: typeof globalFetchConfig) {
    const parsedOptions: RequestInit = {
        ...getGlobalFetchConfig(),
        ...config,
        body: config?.body ? JSON.stringify(config.body) : undefined
    };

    const res = await unfetch(url, parsedOptions);
    let json: JsonType | null = null;

    try { json = (await res.json()) || {} }
    catch(err) { if(!config?.ignoreParseErrors) throw err; }

    if(!res.ok && config?.rejects)
        throw new FetchError(res);

    return { res, json };
}

/**
 * Syntactic sugar for calling `fetch(..., { method: 'GET', ... })`.
 */
fetch.get = (url: string, options?: typeof globalFetchConfig) => fetch(url, { method: 'GET', ...options });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'PUT', ... })`.
 */
fetch.put = (url: string, options?: typeof globalFetchConfig) => fetch(url, { method: 'PUT', ...options });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'DELETE', ... })`.
 */
fetch.delete = (url: string, options?: typeof globalFetchConfig) => fetch(url, { method: 'DELETE', ...options });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'POST', ... })`.
 */
fetch.post = fetch;
