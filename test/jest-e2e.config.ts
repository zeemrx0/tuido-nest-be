import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../src/shared/$1',
    '^@user/(.*)$': '<rootDir>/../src/modules/user/$1',
    '^@task/(.*)$': '<rootDir>/../src/modules/task/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
};

export default config;
