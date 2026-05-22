import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../../support/env";
import {LoginPage} from "../../../pages/auth/login.page";
import {NavbarComponent} from "../../../pages/components/navbar.component";
import {getStoredToken, restoreSession, saveSession} from "../../../utils/session";
import {EXPIRED_TOKEN} from "../../../support/data/tokens";
import {Selectors} from "../../../support/data/selectors";

test.describe("storageState logged-in", async () => {
    test.beforeEach(async ({page}) => {
        await page.goto(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
    });

    test('session persists after browser restart', screenshotSelector('nav'),
        async ({page, browser}) => {
            await saveSession(page.context());
            const newPage = await restoreSession(browser, env.BASE_URL);
            await new NavbarComponent(newPage).expectLoggedInUI();
        });

    test('login stores token in localStorage', async ({page}) => {
        const token = await getStoredToken(page);
        expect(token).not.toBeNull();
    });

    test('expired token logs the user out', screenshotSelector('nav'),
        async ({page, pages}) => {
            await page.evaluate((token) =>
                localStorage.setItem('staybnb_token', token), EXPIRED_TOKEN
            );
            await page.reload();
            await pages.navbar.expectLoggedOutUI();
        });

    test('loggedIn user visiting login page redirects to homepage', screenshotSelector(Selectors.authPage),
        async ({page}) => {
            await page.goto(LoginPage.PATH);
            await expect(page).toHaveURL(env.BASE_URL);
        });
})

test.describe('empty storageState/loggedout flow ', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('successfully logging in redirects to homepage', async ({pages}) => {
        await pages.loginPage.loginAsHost();
        await pages.loginPage.expectRedirectToHomepage();
    });

    // negative tests
    test('invalid password should give error', screenshotSelector('form'),
        async ({page, pages}) => {
            await page.goto(env.BASE_URL);
            await pages.navbar.navigateToLogin();
            await pages.loginPage.login(env.HOST_USER_EMAIL, 'wrong-password');
            await pages.loginPage.expectInvalidEmailOrPasswordError();
        });

    test('Email and password are required', screenshotSelector('form'),
        async ({page, pages}) => {
            await page.goto(env.BASE_URL);
            await pages.navbar.navigateToLogin();
            await pages.loginPage.login(env.HOST_USER_EMAIL, '');
            await pages.loginPage.expectEmailAndPasswordAreRequired();
        });
});