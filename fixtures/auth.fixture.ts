import { test as base } from './base';
import { PageManager } from '../pages/page-manager';
import { env } from '../support/env';
import { validUser } from '../support/data/users';
import { Selectors } from '../support/data/selectors';
import { hostAuthFile, guestAuthFile } from '../support/auth-files';

type User = ReturnType<typeof validUser>;

type AuthFixtures = {
    pages: PageManager;
    hostPages: PageManager;
    guestPages: PageManager;
    authenticated: void;
    registered: User;
    loggedOut: void;
};

export const test = base.extend<AuthFixtures>({
    pages: async ({ page }, use) => {
        await use(new PageManager(page));
    },

    hostPages: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: hostAuthFile });
        await use(new PageManager(await context.newPage()));
        await context.close();
    },

    guestPages: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: guestAuthFile });
        await use(new PageManager(await context.newPage()));
        await context.close();
    },

    // TODO is it for host or guest?
    authenticated: async ({ page }, use) => {
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
        await use(user);
    },

    loggedOut: async ({ pages, page }, use) => {
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await pages.navbar.logout();
        await use();
    },
});
