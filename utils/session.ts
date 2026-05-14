import { Browser, Page } from '@playwright/test';
import { env } from "../tests/env";

export async function restoreSession(browser: Browser, url = env.BASE_URL, waitForSelector?: string): Promise<Page> {
    const context = await browser.newContext({ storageState: 'session.json' });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
    }
    return page;
}