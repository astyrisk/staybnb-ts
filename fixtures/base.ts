import { test as base, type TestDetails } from '@playwright/test';
import { screenshotElement } from './screenshotElement';

export const test = base.extend<{}>({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    const failed = testInfo.status !== testInfo.expectedStatus;
    if (!failed) return;

    const annotation = testInfo.annotations.find(
      (a) => a.type === 'screenshot-selector',
    );
    const selector = annotation?.description ?? 'main';
    const fullPagePath = testInfo.outputPath('failed-fullpage.png');
    const elementPath = testInfo.outputPath('failed-section.png');

    try {
      await screenshotElement(page, selector, { fullPagePath, elementPath });
      await testInfo.attach('failed-fullpage', {
        path: fullPagePath,
        contentType: 'image/png',
      });
      await testInfo.attach('failed-section', {
        path: elementPath,
        contentType: 'image/png',
      });
    } catch {
      // selector not in DOM at failure time — skip screenshots
    }
  },
});

export { expect } from '@playwright/test';

export const screenshotSelector = (selector: string): TestDetails => ({
  annotation: { type: 'screenshot-selector', description: selector },
});
