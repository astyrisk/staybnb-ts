import { test as setup } from '@playwright/test';
import { hostAuthFile, guestAuthFile } from '../support/auth-files';
import {LoginPage} from "../pages/auth/login.page";
import fs from 'fs';

const isCI = !!process.env.CI;

setup('authenticate as host', async ({ page }) => {
    // if (!isCI && fs.existsSync(hostAuthFile)) return;
    await new LoginPage(page).loginAsHost();
    await page.context().storageState({ path: hostAuthFile });
});

setup('authenticate as guest', async ({ page }) => {
    // if (!isCI && fs.existsSync(guestAuthFile)) return;
    await new LoginPage(page).loginAsGuest();
    await page.context().storageState({ path: guestAuthFile });
});
