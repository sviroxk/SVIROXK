import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } } },
  ],
  timeout: 120_000,
  expect: { timeout: 8_000 },
  webServer: { command: 'VITE_CONTACT_EMAIL=sviroxk@gmail.com VITE_CONTACT_ENDPOINT=https://formsubmit.co/ajax/sviroxk@gmail.com npm run build && npm run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout: 90_000 },
})
