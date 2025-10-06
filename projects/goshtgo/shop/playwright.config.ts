import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',          // test files folder
  timeout: 30 * 10000,          // 30s default timeout
  use: {
    baseURL: 'http://localhost:3003',  // React dev server URL
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
  },
});
