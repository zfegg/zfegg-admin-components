const fs = require("fs");
const {resolve} = require("path");

const config = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    // setupFiles: [
        // require.resolve('react-app-polyfill/jsdom'),
    // ],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    // moduleFileExtensions: ['node'].filter(
    //     ext => !ext.includes('mjs')
    // ),
    // watchPlugins: [
    //     'jest-watch-typeahead/filename',
    //     'jest-watch-typeahead/testname',
    // ],
    resetMocks: true,
}

/** @type { import('@jest/types').Config.InitialOptions } */
module.exports = {
    ...config,
    verbose: true,
    preset: 'ts-jest',
    setupFilesAfterEnv: ["./src/setupTests.ts"],
    // "preset": "react",
    // "testRegex": "(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    globals: {
        window: {},
    },
};
