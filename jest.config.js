
// module.exports = {
//   verbose: true,
//   setupFilesAfterEnv: ['./test/jest-setup.js'],
//   coverageReporters: ['json-summary', 'json-summary', 'text', 'lcov']
// };

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['^.+\\.js$'],

  // bail: 1,
  verbose: true,
  // automock: false,
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  coverageReporters: ['json-summary', 'json-summary', 'text', 'lcov']
};
