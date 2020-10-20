// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

const targets = '>1% in US and not ie 11';

module.exports = {
    parserOpts: { strictMode: true },
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-transform-typescript',
    ],
    env: {
        // * Used by Jest and `npm test`
        test: {
            sourceMaps: 'both',
            presets: [
                ['@babel/preset-env', { targets: targets }],
                ['@babel/preset-typescript', { allowDeclareFields: true }],
                // ? We don't care about minification
            ]
        },
        // * Used by `npm run build`
        production: {
            presets: [
                ['@babel/preset-env', { targets: targets }],
                ['@babel/preset-typescript', { allowDeclareFields: true }],
                // ? Webpack will handle minification
            ]
        },
        // * Used for compiling ESM code into ./dist/lib/
        esm: {
            presets: [
                ['@babel/preset-env', {
                    // ? https://babeljs.io/docs/en/babel-preset-env#modules
                    modules: false,
                    // ? https://nodejs.org/en/about/releases
                    targets: { node: '10.13.0' }
                }],
                ['@babel/preset-typescript', { allowDeclareFields: true }],
                // ? The end user will handle minification
            ]
        },
    }
};
