
module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./test/jest-setup.js'],
  coverageReporters: ['json-summary', 'json-summary', 'text', 'lcov']
};