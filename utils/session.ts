import { Browser, Page } from '@playwright/test';
import { env } from "../tests/env";

export async function getStoredToken(page: Page): Promise<string | null> {
    return page.evaluate(() => localStorage.getItem('staybnb_token'));
}

export async function restoreSession(browser: Browser, url = env.BASE_URL, waitForSelector?: string): Promise<Page> {
    const context = await browser.newContext({ storageState: 'environments/session.json' });
    const page = await context.newPage();
    await page.goto(url);
    if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
    }
    return page;
}