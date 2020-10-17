import {
    fetch,
    getGlobalFetchConfig,
    setGlobalFetchConfig
} from '../src/index'

import { unitServer } from './setup'

describe('isomorphic-json-fetch [UNIT TESTS]', () => {
    describe('::fetch', () => {
        it('fetches from a server as expected', async () => {
            expect.hasAssertions();

            await unitServer({
                code: 200,
                client: async ({ url }) => expect((await fetch(url)).json).toStrictEqual({ method: 'POST'})
            });
        });

        it("rejects with FetchError if non-2xx & rejects=true; doesn't if rejects=false", async () => {
            expect.hasAssertions();

            await unitServer({
                code: 299,
                client: async ({ url }) => expect((await fetch(url)).json).toStrictEqual({ method: 'POST'})
            });

            await unitServer({
                code: 404,
                client: async ({ url }) => expect((await fetch(url)).error).toStrictEqual({ method: 'POST'})
            });

            await unitServer({
                code: 404,
                client: async ({ url }) => {
                    expect((await fetch(url, { rejects: false })).error).toStrictEqual({ method: 'POST'});
                }
            });

            await unitServer({
                code: 404,
                client: async ({ url }) => expect(fetch(url, { rejects: true })).toReject()
            });
        });

        it('rejects if bad JSON request body', async () => {
            expect.hasAssertions();

            await unitServer({
                code: 200,
                client: async ({ url }) => {
                    const fakeObj = BigInt(100) as unknown as Record<string, unknown>;
                    await expect(fetch(url, { body: fakeObj })).toReject();
                }
            });
        });

        it('rejects if bad JSON response body', async () => {
            expect.hasAssertions();

            await unitServer({
                code: 200,
                client: async ({ url }) => expect(fetch(url)).toReject(),
                server: (_, res) => res.end('{"broken":"json"')
            });
        });

        it('returns a ServerResponse instance and a JSON object', async () => {
            expect.hasAssertions();

            await unitServer({
                code: 200,
                client: async ({ url }) => {
                    const { res, json, ...rest } = await fetch(url);

                    expect(res).toBeDefined();
                    expect(json).toBeDefined();
                    expect(rest).toBeEmpty();
                }
            });
        });

        it('sugar methods work as expected', async () => {
            expect.hasAssertions();

            await unitServer({
                code: 200,
                client: async ({ url }) => {
                    const { json: j1 } = await fetch.get(url)
                    const { json: j2 } = await fetch.post(url);
                    const { json: j3 } = await fetch.put(url);
                    const { json: j4 } = await fetch.delete(url);

                    expect(j1).toStrictEqual({ method: 'GET' });
                    expect(j2).toStrictEqual({ method: 'POST' });
                    expect(j3).toStrictEqual({ method: 'PUT' });
                    expect(j4).toStrictEqual({ method: 'DELETE' });
                }
            });
        });
    });

    describe('::setGlobalFetchConfig', () => {
        it('`fetch()` respects new global config', async () => {
            expect.hasAssertions();

            const newConfig = { method: 'PUT' };
            setGlobalFetchConfig(newConfig);

            await unitServer({
                code: 200,
                client: async ({ url }) => expect((await fetch(url)).json).toStrictEqual({ method: 'PUT'})
            });
        });
    });

    describe('::getGlobalFetchConfig', () => {
        it('strictly returns the set global config object', () => {
            expect.hasAssertions();

            const newConfig = { method: 'FIRE' };
            setGlobalFetchConfig(newConfig);

            expect(getGlobalFetchConfig()).toBe(newConfig);
        });
    });
});
