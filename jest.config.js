module.exports = {
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.d.ts',
        '!test/**',
        '!node_modules/**',
    ],
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    verbose: false,
    testPathIgnorePatterns: [ '/node_modules/' ],
    setupFilesAfterEnv: [ './test/setup.ts' ],
};
