import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {LoginPage} from "../../../pages/auth/login.page";
import {NavbarComponent} from "../../../pages/components/navbar.component";
import {getStoredToken, restoreSession} from "../../../utils/session";
import {EXPIRED_TOKEN} from "../../data/tokens";
import {Selectors} from "../../data/selectors";

test('successfully logging in redirects to homepage', async ({page, loggedInPage}) => {
    await loggedInPage.expectRedirectToHomepage();
});

test('session persists after browser restart', screenshotSelector('nav'),
    async ({browser, loggedInPage}) => {
        await loggedInPage.saveSession(loggedInPage.context());
        const newPage = await restoreSession(browser, env.BASE_URL, Selectors.navbarUserBtn);
        await new NavbarComponent(newPage).expectLoggedInUI();
    });

test('invalid password should give error', screenshotSelector('form'),
    async ({page}) => {
        await page.goto(env.BASE_URL);
        await new NavbarComponent(page).navigateToLogin();
        const loginPage = new LoginPage(page);
        await loginPage.login(env.HOST_USER_EMAIL, 'wrong-password');
        await loginPage.expectInvalidEmailOrPasswordError();
    });

test('Email and password are required', screenshotSelector('form'),
    async ({page}) => {
        await page.goto(env.BASE_URL);
        await new NavbarComponent(page).navigateToLogin();
        const loginPage = new LoginPage(page);
        await loginPage.login(env.HOST_USER_EMAIL, '');
        await loginPage.expectEmailAndPasswordAreRequired();
    });

test('login stores token in localStorage', async ({page, loggedInPage}) => {
    const token = await getStoredToken(page);
    expect(token).not.toBeNull();
});

test('expired token logs the user out', screenshotSelector('nav'),
    async ({page, loggedInPage}) => {
        await page.evaluate((token) => localStorage.setItem('staybnb_token', token), EXPIRED_TOKEN);
        await page.reload();
        await new NavbarComponent(page).expectLoggedOutUI();
    });

test('loggedIn user visiting login page redirects to homepage', screenshotSelector(Selectors.authPage),
    async ({page, loggedInPage}) => {
        await page.goto(LoginPage.PATH);
        await expect(page).toHaveURL(env.BASE_URL);
    });
