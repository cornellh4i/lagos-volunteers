
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        'tests/'
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    setupFiles: ["dotenv/config"],
    moduleFileExtensions: ['js', 'ts'],
    maxWorkers: 1,
    testTimeout: 30000,
};