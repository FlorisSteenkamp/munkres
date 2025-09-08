
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    moduleFileExtensions: ['ts', 'js'],
    resolver: "jest-ts-webcompat-resolver",
    // preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    collectCoverage: false,  // Make true again!
    coverageProvider: 'v8',
    testTimeout: 15000,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    }
};