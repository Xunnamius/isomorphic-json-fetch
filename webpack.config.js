// This webpack config is used for helping transpile src/ => dist/ as dual
// UMD/CJS2+ES2015

const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'main',
    mode: 'production',
    target: 'node',
    node: false,

    entry: `${__dirname}/src/index.ts`,

    output: {
        filename: 'index.js',
        path: `${__dirname}/dist/lib`,
        globalObject: 'this',
        libraryTarget: 'umd'
    },

    externals: [nodeExternals()],

    stats: {
        //orphanModules: true, // ? Webpack 5
        providedExports: true,
        usedExports: true,
    },

    resolve: { extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'] },
    module: { rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }] },
    optimization: { usedExports: true },
    //ignoreWarnings: [/critical dependency:/i], // ? Webpack 5
};
