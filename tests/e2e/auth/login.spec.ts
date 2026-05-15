import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {LoginPage} from "../../../pages/auth/login.page";
import {NavbarComponent} from "../../../pages/components/navbar.component";
import {restoreSession} from "../../../utils/session";
import {EXPIRED_TOKEN} from "../../data/tokens";

test('successfully logging in redirects to homepage', async ({page, loggedInPage}) => {
    await loggedInPage.expectRedirectToHomepage();
});

test('session persists after browser restart', screenshotSelector('nav'),
    async ({browser, loggedInPage}) => {
        await loggedInPage.context().storageState({ path: 'session.json' });
        const newPage = await restoreSession(browser, env.BASE_URL, '.navbar-user-btn');
        await new NavbarComponent(newPage).expectLoggedInUI();
    });

test('invalid password should give error', screenshotSelector('form'),
    async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(env.HOST_USER_EMAIL, 'wrong-password');
        await loginPage.expectInvalidEmailOrPasswordError();
    });

test('Email and password are required', screenshotSelector('form'),
    async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(env.HOST_USER_EMAIL, '');
        await loginPage.expectEmailAndPasswordAreRequired();
    });

test('login stores token in localStorage', async ({page, loggedInPage}) => {
    const token = await loggedInPage.getStoredToken();
    expect(token).not.toBeNull();
});

test('expired token logs the user out', screenshotSelector('nav'),
    async ({page, loggedInPage}) => {
        await page.evaluate((token) => localStorage.setItem('staybnb_token', token), EXPIRED_TOKEN);
        await page.reload();
        await new NavbarComponent(page).expectLoggedOut();
    });

test('logout clears the session', screenshotSelector('nav'),
    async ({page, loggedInPage}) => {
        await new NavbarComponent(page).logout();
        const token = await loggedInPage.getStoredToken();
        expect(token).toBeNull();
    });

test('loggedIn user visiting login page redirects to homepage', screenshotSelector('.auth-page'),
    async ({page, loggedInPage}) => {
        await loggedInPage.goto();
        await expect(page).toHaveURL(env.BASE_URL);
    });
