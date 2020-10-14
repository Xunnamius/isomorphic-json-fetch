module.exports = {
    collectCoverageFrom: [ 'src/**/*.ts' ],
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    verbose: false,
    testPathIgnorePatterns: [ '/node_modules/' ],
    setupFilesAfterEnv: [ './test/setup.ts' ],
};
