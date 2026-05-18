import { test as base } from './base';
import { Page } from '@playwright/test';
import * as fs from 'fs';
import { PageManager } from '../pages/page-manager';
import { env } from '../support/env';
import { validUser } from '../support/data/users';
import { Selectors } from '../support/data/selectors';

const SESSION_PATH = 'environments/session.json';

function readStoredToken(): string | null {
    try {
        const session = JSON.parse(fs.readFileSync(SESSION_PATH, 'utf-8'));
        return (session.origins ?? [])
            .flatMap((o: { localStorage?: { name: string; value: string }[] }) => o.localStorage ?? [])
            .find((e: { name: string }) => e.name === 'staybnb_token')?.value ?? null;
    } catch {
        return null;
    }
}

async function injectToken(page: Page): Promise<void> {
    const token = readStoredToken();
    if (!token) throw new Error(`No token found in ${SESSION_PATH} — did globalSetup run?`);
    await page.addInitScript((t) => {
        if (!localStorage.getItem('staybnb_token')) localStorage.setItem('staybnb_token', t);
    }, token);
}

export const test = base.extend<{ pages: PageManager; authenticated: void; registered: void; loggedOut: void }>({

    pages: async ({ page }, use) => {
        await use(new PageManager(page));
    },

    authenticated: async ({ pages, page }, use) => {
        await injectToken(page);
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await use();
    },

    registered: async ({ pages, page }, use) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, user.email, user.password, user.password);
        await page.waitForURL(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await use();
    },

    loggedOut: async ({ pages, page }, use) => {
        await injectToken(page);
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await pages.navbar.logout();
        await use();
    },
});
