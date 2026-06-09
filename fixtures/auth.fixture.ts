import { test as base } from './base';
import { PageManager } from '../pages/page-manager';
import { env } from '../support/env';
import { validUser } from '../support/data/users';
import { Selectors } from '../support/data/selectors';
import { hostAuthFile, guestAuthFile } from '../support/auth-files';
import { Booking } from '../support/data/bookings';

type User = ReturnType<typeof validUser>;

type AuthFixtures = {
    pages: PageManager;
    hostPages: PageManager;
    guestPages: PageManager;
    authenticated: void;
    registered: User;
    loggedOut: void;
    bookedProperty: Booking;
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

    // NOTE can be used if the default current authentication is for host and we do need different context for guests
    guestPages: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: guestAuthFile });
        await use(new PageManager(await context.newPage()));
        await context.close();
    },

    // NOTE wait for authentication fixture
    authenticated: async ({ page }, use) => {
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await use();
    },

    // NOTE creates a new account
    registered: async ({ pages, page }, use) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, user.email, user.password, user.password);
        await page.waitForURL(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await use(user);
    },

    // NOTE returns context's page after logging out
    loggedOut: async ({ pages, page }, use) => {
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await pages.navbar.logout();
        await use();
    },

    bookedProperty: async ({ pages }, use) => {
        const booking = await pages.propertyDetailsPage.bookSeededProperty();
        await use(booking);
        await pages.myBookingPage.cancelBooking(booking);
    },
});
