import { Browser, BrowserContext, Page } from '@playwright/test';
import { Selectors } from "../support/data/selectors";
import { env } from "../support/env";

export const SESSION_PATH = 'environments/session.json';

export async function saveSession(context: BrowserContext): Promise<void> {
    await context.storageState({ path: SESSION_PATH });
}

export async function getStoredToken(page: Page): Promise<string | null> {
    return page.evaluate(() => localStorage.getItem('staybnb_token'));
}

export async function restoreSession(browser: Browser, url = env.BASE_URL): Promise<Page> {
    // TODO do I need to do this?
    const context = await browser.newContext({ storageState: SESSION_PATH });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForSelector(Selectors.navbarUserBtn);
    return page;
}