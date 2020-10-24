import { AnyFunction } from '@ergodark/types';
import {
    fetch,
    setGlobalFetchConfig
} from '../src/index'

import { unitServer } from './setup'

const useSwr = async (key: string, fetcher: (url: string) => Promise<unknown>) => {
    let data: { myData: number } = { myData: -1 };
    let error;

    try { data = (await fetcher(key)) as typeof data }
    catch(e) { error = e }

    return { data, error };
};

const TEST_VAL = 5;
const TEST_OBJ = JSON.stringify({ myData: TEST_VAL });
const BAD_STR = '{"bad json":';

const clientFactory = async (
    ex: (doSomethingWith: AnyFunction, handleErr: AnyFunction, handleException: AnyFunction) => (params: {
        url: string
    }) => Promise<void>,
    o: number[][]
) => {
    const d = jest.fn((n: number) => expect(n).toBe(TEST_VAL));
    const e = jest.fn();
    const x = jest.fn();

    // ? Test 4 possibilities (in order):
    // ? 1. ok response w/ bad json
    // ? 2. ok response w/ good json
    // ? 3. non-ok response w/ bad json
    // ? 4. non-ok response w/ good json

    await unitServer({ client: ex(d, e, x), server: (_, res) => res.end(BAD_STR) });

    expect(d).toHaveBeenCalledTimes(o[0][0]);
    expect(e).toHaveBeenCalledTimes(o[0][1]);
    expect(x).toHaveBeenCalledTimes(o[0][2]);

    await unitServer({ client: ex(d, e, x), server: (_, res) => res.end(TEST_OBJ) });

    expect(d).toHaveBeenCalledTimes(o[1][0]);
    expect(e).toHaveBeenCalledTimes(o[1][1]);
    expect(x).toHaveBeenCalledTimes(o[1][2]);

    await unitServer({ client: ex(d, e, x), server: (_, res) => {
        res.statusCode = 404;
        res.end(BAD_STR);
    }});

    expect(d).toHaveBeenCalledTimes(o[2][0]);
    expect(e).toHaveBeenCalledTimes(o[2][1]);
    expect(x).toHaveBeenCalledTimes(o[2][2]);

    await unitServer({ client: ex(d, e, x), server: (_, res) => {
        res.statusCode = 404;
        res.end(TEST_OBJ);
    }});

    expect(d).toHaveBeenCalledTimes(o[3][0]);
    expect(e).toHaveBeenCalledTimes(o[3][1]);
    expect(x).toHaveBeenCalledTimes(o[3][2]);
};

describe('isomorphic-json-fetch [README EXAMPLES]', () => {
    test('example 1-1 works', async () => {
        expect.hasAssertions();

        const d = jest.fn((n: number) => expect(n).toBe(TEST_VAL));

        // 1. With zero configuration

        await unitServer({
            client: async ({ url: URL }) => {
                const { json } = await fetch<{ myData: number }>(URL);
                json?.myData && d(json.myData);
            },
            server: (_, res) => res.end(TEST_OBJ)
        });

        expect(d).toHaveBeenCalledTimes(1);
    });

    test('example 1-2 works', async () => {
        expect.hasAssertions();

        // 2. With simple error handling

        await clientFactory((doSomethingWith, handleErr, handleException) => async ({ url: URL }) => {
            try {
                const { res, json } = await fetch.get<{ myData: number }>(URL);

                if(!json) return void handleErr(`response code outside 200-299: ${res.status}`);
                doSomethingWith(json.myData);
            }

            catch(e) {
                // Could be a JSON parse error or a network issue
                handleException(`fetch failed: ${e}`);
            }
        }, [ [0, 0, 1], [1, 0, 1], [1, 0, 2], [1, 1, 2] ]);
    });

    test('example 1-3 works', async () => {
        expect.hasAssertions();

        // 3. Explicitly capturing JSON from non-2xx responses

        await clientFactory((doSomethingWith, handleErr, handleException) => async ({ url: URL }) => {
            const configuration = { // <== this can also be set globally, see below
                method: 'POST',
                body: { query: 'some-string' }
            };

            try {
                const { json, error } = await fetch<{ myData: number }, { message: string }>(URL, configuration);

                if(error) return void handleErr(error.message);
                json?.myData && doSomethingWith(json.myData);
            }

            catch(e) {
                // Could be a JSON parse error or a network issue
                handleException(`fetch failed: ${e}`);
            }
        }, [ [0, 0, 1], [1, 0, 1], [1, 0, 2], [1, 1, 2] ]);
    });

    test('example 1-4 works', async () => {
        expect.hasAssertions();

        // 4. Handling non-2xx responses in your own catch block instead

        await clientFactory((doSomethingWith, _, handleException) => async ({ url: URL }) => {
            try { doSomethingWith((await fetch.post<{ myData: number }>(URL, { rejects: true })).json?.myData) }
            catch(e) {
                // ! Could be a JSON parse error or a network issue OR if the
                // ! status code is not between 200-299!
                handleException(`fetch failed: ${e}`);
            }
        }, [ [0, 0, 1], [1, 0, 1], [1, 0, 2], [1, 0, 3] ]);
    });

    test('example 1-5 works', async () => {
        expect.hasAssertions();

        // 5. As a quick little fetcher for SWR

        await clientFactory((doSomethingWith, handleErr) => async ({ url: URL }) => {
            const { data, error } = await useSwr(URL, fetch.swr);

            if(error) return void handleErr('failed to load');
            if(!data) return void doSomethingWith(5);
            return void doSomethingWith(data.myData);
        }, [ [0, 1, 0], [1, 1, 0], [1, 2, 0], [1, 3, 0] ]);
    });

    test('example 2 works', async () => {
        expect.hasAssertions();

        // This sets a new default configuration object for all fetch calls
        setGlobalFetchConfig({
            method: 'GET', // ? POST is the default
            credentials: 'include', // ? 'same-origin' by default (no cookies sent!)
            // content-type header is included by default so no need to add it yourself!
        });

        let body: string;

        await unitServer({
            client: async ({ url: URL }) => {
                body = TEST_OBJ;

                // Uses the new global config
                let { json } = await fetch(URL);

                expect(json).toStrictEqual({ myData: TEST_VAL });

                // You can always override default/global config by providing your own
                ({ json } = await fetch(URL, {
                    method: 'GET',
                    // `headers` and `credentials` keys were not overridden, so their values are
                    // inherited from global config like normal
                }));

                expect(json).toStrictEqual({ myData: TEST_VAL });

                body = BAD_STR;

                // This will ignore any errors thrown by `JSON.parse()`
                ({ json } = await fetch(URL, { method: 'GET', ignoreParseErrors: true }));

                expect(json).toBeUndefined();

                body = TEST_OBJ;

                // TypeScript support for defining json return type and error return type
                const { json: j } = await fetch.get<'technically valid JSON', { error: string }>(URL);

                expect(j).not.toBeUndefined();
            },
            server: (_, res) => res.end(body)
        });
    });
});
