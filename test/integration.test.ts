/* eslint-disable @typescript-eslint/no-explicit-any */
import { main } from '../package.json'
import { getGlobalFetchConfig as getExpectedConfig } from '../src/index'
import { unitServer, unitServerPuppeteer } from './setup'

describe('isomorphic-json-fetch [INTEGRATION TESTS]', () => {
    describe('browser environment', () => {
        it('should export expected members', async () => {
            expect.hasAssertions();

            await unitServerPuppeteer({
                client: async ({ page, run }) => {
                    await run(`${__dirname}/../${main}`);
                    expect(await page.evaluate(() => Object.keys(window))).toIncludeAllMembers([
                        'getGlobalFetchConfig',
                        'setGlobalFetchConfig',
                        'fetch',
                        'unfetch',
                    ]);
                }
            });
        });

        it('should allow getting and setting global config', async () => {
            expect.hasAssertions();

            await unitServerPuppeteer({
                client: async ({ page, run }) => {
                    await run(`${__dirname}/../${main}`);

                    expect(await page.evaluate(() => (window as any).getGlobalFetchConfig())).toStrictEqual(getExpectedConfig());
                    await page.evaluate(() => (window as any).setGlobalFetchConfig({ a: 1 }));
                    expect(await page.evaluate(() => (window as any).getGlobalFetchConfig())).toStrictEqual({ a: 1 });
                }
            });
        });

        it('should fetch properly', async () => {
            expect.hasAssertions();

            await unitServerPuppeteer({
                client: async ({ page, run, url }) => {
                    await run(`${__dirname}/../${main}`);

                    expect(await page.evaluate(async url => (await (window as any).fetch(url)).json, url)).toStrictEqual({method: 'POST'});
                    expect(await page.evaluate(async url => (await (window as any).fetch.get(url)).json, url)).toStrictEqual({method: 'GET'});
                }
            });
        });
    });

    describe('server environment', () => {
        it('should export expected members', async () => {
            expect.hasAssertions();

            const {
                getGlobalFetchConfig,
                setGlobalFetchConfig,
                fetch,
                unfetch,
                ...rest
            } = await import(`${__dirname}/../${main}`);

            expect(getGlobalFetchConfig).toBeDefined();
            expect(setGlobalFetchConfig).toBeDefined();
            expect(fetch).toBeDefined();
            expect(unfetch).toBeDefined();
            expect(rest).toBeEmpty();
        });

        it('should allow getting and setting global config', async () => {
            expect.hasAssertions();

            const {
                getGlobalFetchConfig,
                setGlobalFetchConfig,
            } = await import(`${__dirname}/../${main}`);

            expect(getGlobalFetchConfig()).toStrictEqual(getExpectedConfig());
            setGlobalFetchConfig({ a: 1 });
            expect(getGlobalFetchConfig()).toStrictEqual({ a: 1 });
            setGlobalFetchConfig(getExpectedConfig());
            expect(getGlobalFetchConfig()).toStrictEqual(getExpectedConfig());
        });

        it('should fetch properly', async () => {
            expect.hasAssertions();

            const { fetch } = await import(`${__dirname}/../${main}`);

            await unitServer({
                client: async ({ url }) => {
                    expect((await fetch(url)).json).toStrictEqual({ method: 'POST' });
                    expect((await fetch.get(url)).json).toStrictEqual({ method: 'GET' });
                }
            });
        });
    });
});
