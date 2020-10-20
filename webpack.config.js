// This webpack config is used for transpiling src/ to UMD+ES2015 and depositing
// bundled output to dist/

process.env.NODE_ENV = 'production';

module.exports = {
    name: 'umd',
    target: 'node',
    mode: 'production',
    entry: `${__dirname}/src/index.ts`,

    output: {
        filename: 'umd.js',
        path: `${__dirname}/dist`,
        globalObject: 'this',
        libraryTarget: 'umd'
    },

    resolve: {
        extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
        enforceExtension: true,
    },

    module: { rules: [{ test: /\.(ts|mjs)x?$/, loader: 'babel-loader', exclude: /node_modules/ }] },
};
