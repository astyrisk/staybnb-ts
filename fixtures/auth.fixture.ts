import {test as base} from './base';
import {Page} from '@playwright/test';
import {LoginPage} from "../pages/auth/login.page";
import {RegisterPage} from "../pages/auth/register.page";
import {NavbarComponent} from "../pages/components/navbar.component";
import {env} from "../tests/env";
import {validUser} from "../tests/data/users";

export const test = base.extend<{loggedInPage: LoginPage; registeredPage: RegisterPage; loggedOutPage: Page}>({

    loggedInPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        await page.waitForURL(env.BASE_URL, { waitUntil: 'networkidle' });

        await use(loginPage);
    },

    registeredPage: async ({page}, use) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, user.email, user.password, user.password);
        await page.waitForURL(env.BASE_URL, { waitUntil: 'networkidle' });

        await use(registerPage);
    },

    loggedOutPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        await page.waitForURL(env.BASE_URL, { waitUntil: 'networkidle' });
        await new NavbarComponent(page).logout();

        await use(page);
    },
});
