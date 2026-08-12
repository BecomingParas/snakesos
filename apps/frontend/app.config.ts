import { defineConfig } from '@tanstack/start/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    server: {
      port: 4200,
      strictPort: true,
      host: true,
    },
    build: {
      target: 'esnext',
    },
  },
});
