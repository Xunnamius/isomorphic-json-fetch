/* eslint-disable @typescript-eslint/no-explicit-any */
import listen from 'test-listen'
import puppeteer from 'puppeteer'
import { promises as fs } from 'fs'
import { createServer } from 'http'
import { main } from '../package.json'
import { getGlobalFetchConfig as getExpectedConfig } from '../src/index'

import type { IncomingMessage, Server, ServerResponse } from 'http'
import type { Browser, Page } from 'puppeteer'

const { readFile } = fs;

const unitServer = async ({ code, client: clientFn, server: serverFn }: {
    code?: number,
    client: ({ url }: { url: string }) => Promise<void>,
    server?: (req: IncomingMessage, res: ServerResponse) => void
}) => {
    let server: Server | null = null;

    try {
        const url = await listen(server = createServer((req, res) => {
            res.statusCode = code || 200;
            (serverFn
                ? serverFn
                : (q: typeof req, s: typeof res) => s.end(JSON.stringify({ method: q.method }))
            )(req, res);
        }));

        await clientFn({ url });
    }

    finally { server?.close() }
};

const unitServerPuppeteer = async ({ code, client: clientFn, server: serverFn }: {
    code?: number,
    client: ({ browser, page, run, url }: {
        browser: Browser,
        page: Page,
        run: (path: string) => ReturnType<Page['evaluate']>,
        url: string
    }) => Promise<void>,
    server?: (req: IncomingMessage, res: ServerResponse) => void
}) => {
    let server: Server | null = null;
    let browser: Browser | null = null;

    try {
        const url = await listen(server = createServer((req, res) => {
            res.statusCode = code || 200;
            (serverFn
                ? serverFn
                : (q: typeof req, s: typeof res) => s.end(JSON.stringify({ method: q.method }))
            )(req, res);
        }));

        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const run = async (path: string) => page.evaluate(await readFile(path, 'utf-8'));

        await clientFn({ browser, page, run, url });
    }

    finally {
        await browser?.close();
        server?.close();
    }
};

describe('[INTEGRATION] isomorphic-json-fetch', () => {
    describe('browser environment', () => {
        it('should export expected members', async () => {
            expect.hasAssertions();

            await unitServerPuppeteer({
                client: async ({ page, run }) => {
                    await run(`${__dirname}/../${main}`);
                    expect(await page.evaluate(() => Object.keys(window))).toIncludeAllMembers([
                        'FetchError',
                        'getGlobalFetchConfig',
                        'setGlobalFetchConfig',
                        'fetch'
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
                FetchError,
                getGlobalFetchConfig,
                setGlobalFetchConfig,
                fetch,
                ...rest
            } = await import(`${__dirname}/../${main}`);

            expect(FetchError).toBeDefined();
            expect(getGlobalFetchConfig).toBeDefined();
            expect(setGlobalFetchConfig).toBeDefined();
            expect(fetch).toBeDefined();
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
