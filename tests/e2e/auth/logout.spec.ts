import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {LoginPage} from "../../../pages/auth/login.page";
import {getStoredToken} from "../../../utils/session";
import {Selectors} from "../../data/selectors";

test('logout shows logged-out UI', screenshotSelector('nav'),
    async ({pages, loggedOut}) => {
        await pages.navbar.expectLoggedOutUI();
    });

test('logout clears the token from localStorage', async ({page, loggedOut}) => {
    const token = await getStoredToken(page);
    expect(token).toBeNull();
});

test('logout redirects to homepage', async ({page, pages, authenticated}) => {
    await pages.navbar.logout();
    await expect(page).toHaveURL(env.BASE_URL);
});

test('logged out user can visit login page', screenshotSelector(Selectors.authPage),
    async ({page, pages, loggedOut}) => {
        await pages.navbar.navigateToLogin();
        await expect(page).toHaveURL(LoginPage.PATH);
    });

test('user can log back in after logout', screenshotSelector('nav'),
    async ({page, pages, loggedOut}) => {
        await pages.navbar.navigateToLogin();
        await pages.loginPage.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        await page.waitForURL(env.BASE_URL);
        await page.waitForSelector(Selectors.navbarUserBtn);
        await pages.navbar.expectLoggedInUI();
    });
