module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/__testUtilities__.ts'
  ]
};