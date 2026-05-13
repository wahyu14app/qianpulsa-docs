import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('E2E: Login and Dashboard Access', async ({ page }) => {
  const errorReport: any[] = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Global Console Error Listener
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errorReport.push({
        stage: 'Client',
        type: 'ConsoleError',
        message: msg.text(),
        url: page.url()
      });
    }
  });

  // Global Page Error Listener (JS Exceptions)
  page.on('pageerror', exception => {
    errorReport.push({
      stage: 'Client',
      type: 'JSException',
      message: exception.message,
      url: page.url()
    });
  });

  // Global Network Request Error Listener
  page.on('requestfailed', request => {
    errorReport.push({
      stage: 'Network',
      type: 'RequestFailed',
      message: request.failure()?.errorText || 'Unknown network error',
      url: request.url()
    });
  });

  try {
    // Stage 1: Authentication (Login)
    await page.goto('/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Check for UI error messages
    const errorElement = await page.$('.error-message');
    if (errorElement) {
      errorReport.push({
        stage: 'Auth',
        type: 'UIValidationError',
        message: await errorElement.textContent(),
        url: page.url()
      });
    }

    // Stage 2: Dashboard Access
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);

  } catch (error: any) {
    errorReport.push({
      stage: 'General',
      type: 'ExecutionError',
      message: error.message,
      url: page.url()
    });
  } finally {
    if (errorReport.length > 0) {
      const reportPath = path.join(process.cwd(), `error-report-${timestamp}.json`);
      fs.writeFileSync(reportPath, JSON.stringify({ timestamp, errors: errorReport }, null, 2));
      console.log(`Error report saved to ${reportPath}`);
    }
  }
});
