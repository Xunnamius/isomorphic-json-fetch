import unfetch from 'isomorphic-unfetch'

import type { SerializedValue } from '@ergodark/types'

export type FetchConfig = Omit<RequestInit, 'body'> & {
    swr?: boolean,
    rejects?: boolean,
    ignoreParseErrors?: boolean,
    body?: Record<string, unknown>
};

/**
 * Re-export these
 */
export { unfetch };

/**
 * The default `config` all `fetch()` calls use by default. Will be merged
 * (overridden) with the `config` object passed into each call to `fetch()`, if
 * provided. See [unfetch](https://github.com/developit/unfetch) for valid
 * config keys.
 */
let globalFetchConfig: FetchConfig = {
    method: 'POST',
    // credentials: 'include', // ? If you want to send and receive cookies
    headers: { 'Content-Type': 'application/json' },
};

/**
 * Get the default config object merged in during all `fetch()` calls.
 */
export function getGlobalFetchConfig() {
    return globalFetchConfig;
}

/**
 * Set the default config object merged in during all `fetch()` calls.
 */
export function setGlobalFetchConfig(config: FetchConfig) {
    globalFetchConfig = config;
}

/**
 * Performs an isomorphic (un)fetch and returns the JsonType response or throws
 * as SWR expects.
 *
 * Example:
 * ```
 *   const { data: json, error } = useSwr('api/endpoint', fetch.swr);
 *   // Or:                  ... = useSwr('api/endpoint', key => fetch(key, { swr: true }));
 *
 *   if(error) <div>Error: {error.message}</div>;
 *   return <div>Hello, your data is: {json.data}</div>;
 * ```
 */
export async function fetch<
  JsonType extends SerializedValue = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ErrorType extends SerializedValue = JsonType>(
    url: string,
    config?: Omit<FetchConfig, 'swr'> & { swr: true }
): Promise<JsonType>;
/**
 * Performs an isomorphic (un)fetch.
 *
 * Throws:
 *   1) When parsing the body for JSON content fails and `config ⊅
 *      {ignoreParseErrors: true }`
 *   2) When `config ⊇ { rejects: true }` or `config ⊇ { swr: true }` and a
 *      non-2xx response is received.
 *
 * Otherwise, returns a Response object `res` and parsed response body as `json`
 * (`===undefined` on non-2xx response) or `error` (`===undefined` on 2xx
 * response).
 *
 * Example:
 * ```
 *   const { json, error } = fetch.post<{ data: number }, { message: string }>(
 *     'api/endpoint',
 *     {
 *       headers: { key: apiKey },
 *       body: requestData
 *     }
 *   );
 *
 *   if(error) throw error.message;
 *   return json.data;
 * ```
 */
export async function fetch<
  JsonType extends SerializedValue = Record<string, unknown>,
  ErrorType extends SerializedValue = JsonType>(
    url: string,
    config?: FetchConfig
): Promise<{ res: Response, json: JsonType | undefined, error: ErrorType | undefined }>;
export async function fetch<
  JsonType extends SerializedValue = Record<string, unknown>,
  ErrorType extends SerializedValue = JsonType>(
    url: string,
    config?: FetchConfig
): Promise<unknown> {
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
        error = json as ErrorType;
        json = undefined;

        if(parsedOptions?.swr || parsedOptions?.rejects)
            throw error;
    }

    return parsedOptions?.swr ? json : { res, json, error };
}

/**
 * Syntactic sugar for calling `fetch(..., { method: 'GET', ... })`.
 */
fetch.get = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: string,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'GET', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'PUT', ... })`.
 */
fetch.put = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: string,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'PUT', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'DELETE', ... })`.
 */
fetch.delete = <JsonType extends SerializedValue = Record<string, unknown>, ErrorType extends SerializedValue = JsonType>(
  url: string,
  config?: FetchConfig
) => fetch<JsonType, ErrorType>(url, { method: 'DELETE', ...config });

/**
 * Syntactic sugar for calling `fetch(..., { method: 'POST', ... })`.
 */
fetch.post = fetch;

fetch.swr = async (key: string) => fetch(key, { swr: true });
