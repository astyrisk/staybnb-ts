import { test as setup } from '@playwright/test';
import { hostAuthFile, guestAuthFile } from '../support/auth-files';
import {LoginPage} from "../pages/auth/login.page";

setup('authenticate as host', async ({ page }) => {
    await new LoginPage(page).loginAsHost();
    await page.context().storageState({ path: hostAuthFile });
});

setup('authenticate as guest', async ({ page }) => {
    await new LoginPage(page).loginAsGuest();
    await page.context().storageState({ path: guestAuthFile });
});
