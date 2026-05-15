import { test as base } from './base';
import { Page } from '@playwright/test';
import * as fs from 'fs';
import { LoginPage } from '../pages/auth/login.page';
import { RegisterPage } from '../pages/auth/register.page';
import { NavbarComponent } from '../pages/components/navbar.component';
import { env } from '../tests/env';
import { validUser } from '../tests/data/users';

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

export const test = base.extend<{ loggedInPage: LoginPage; registeredPage: RegisterPage; loggedOutPage: Page }>({

    loggedInPage: async ({ page }, use) => {
        await injectToken(page);
        await page.goto(env.BASE_URL);
        await page.waitForSelector('.navbar-user-btn');
        await use(new LoginPage(page));
    },

    registeredPage: async ({ page }, use) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, user.email, user.password, user.password);
        await page.waitForURL(env.BASE_URL);
        await page.waitForSelector('.navbar-user-btn');
        await use(registerPage);
    },

    loggedOutPage: async ({ page }, use) => {
        await injectToken(page);
        await page.goto(env.BASE_URL);
        await page.waitForSelector('.navbar-user-btn');
        await new NavbarComponent(page).logout();
        await use(page);
    },
});
