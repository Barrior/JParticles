import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  // Stop running tests after `n` failures
  bail: 1,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: '50%',

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/$1',
    '^@src/(.*)': '<rootDir>/src/$1',
    '^@test/(.*)': '<rootDir>/test/$1',
  },

  // The root directory that Jest should scan for tests and modules within
  roots: ['<rootDir>/src/', '<rootDir>/test/unit/'],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['<rootDir>/test/unit/@.+/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
}

export default config
