module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@sehlf/jest-mongodb',
  transform: {
     '.+\\.ts$': 'ts-jest'
  },
};

