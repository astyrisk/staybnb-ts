import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

import { LoginPage } from './pages/auth/login.page';
import { env } from './tests/env';
import { Selectors } from './tests/data/selectors';

export default async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
    await page.waitForURL(env.BASE_URL);
    await page.waitForSelector(Selectors.navbarUserBtn);
    await loginPage.saveSession(context);

    await browser.close();
}
