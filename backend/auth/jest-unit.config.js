// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config');

config.testMatch = ['<rootDir>/tests/unit/**/*.spec.ts'];
module.exports = config;
