/* eslint-disable */
import { Config } from 'jest';

const config: Config = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
  setupFilesAfterEnv: ['<rootDir>/src/app/(auth)/__tests__/setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@snake-rescue/ui$': '<rootDir>/../../libs/frontend/ui/src/index.ts',
    '^@snake-rescue/features$': '<rootDir>/../../libs/frontend/features/src/index.ts',
    '^@snake-rescue/frontend-core$': '<rootDir>/../../libs/frontend/core/src/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
  ],
};

export default config;
