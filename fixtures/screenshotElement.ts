import type { Page } from '@playwright/test';

const HIGHLIGHT_ATTR = 'data-pw-highlight';

export interface ScreenshotElementOptions {
  fullPagePath?: string;
  elementPath?: string;
}

export interface ScreenshotElementResult {
  fullPage: Buffer;
  element: Buffer;
}

/**
 * Produces two screenshots of the page:
 *  - `fullPage`: the full page with the target element outlined in red.
 *  - `element`: a cropped screenshot of just the target element, no highlight.
 */
export async function screenshotElement(
  page: Page,
  selector: string,
  options: ScreenshotElementOptions = {},
): Promise<ScreenshotElementResult> {
  const locator = page.locator(selector).first();

  const element = options.elementPath
    ? await locator.screenshot({ path: options.elementPath })
    : await locator.screenshot();

  await addHighlight(page, selector);
  let fullPage: Buffer;
  try {
    fullPage = options.fullPagePath
      ? await page.screenshot({ path: options.fullPagePath, fullPage: true })
      : await page.screenshot({ fullPage: true });
  } finally {
    await removeHighlight(page);
  }

  return { fullPage, element };
}

async function addHighlight(page: Page, selector: string): Promise<void> {
  await page.evaluate(
    ({ selector, attr }) => {
      const target = document.querySelector(selector) as HTMLElement | null;
      if (!target) return;
      target.setAttribute(attr, target.style.boxShadow);
      target.style.boxShadow = '0 0 0 3px #f00, inset 0 0 0 3px #f00';
    },
    { selector, attr: HIGHLIGHT_ATTR },
  );
}

async function removeHighlight(page: Page): Promise<void> {
  await page.evaluate((attr) => {
    const target = document.querySelector(`[${attr}]`) as HTMLElement | null;
    if (!target) return;
    target.style.boxShadow = target.getAttribute(attr) ?? '';
    target.removeAttribute(attr);
  }, HIGHLIGHT_ATTR);
}
