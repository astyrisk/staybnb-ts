import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {LoginPage} from "../../../pages/auth/login.page";
import {NavbarComponent} from "../../../pages/components/navbar.component";
import {getStoredToken} from "../../../utils/session";

test('logout shows logged-out UI', screenshotSelector('nav'),
    async ({page, loggedOutPage}) => {
        await new NavbarComponent(page).expectLoggedOutUI();
    });

test('logout clears the token from localStorage', async ({page, loggedOutPage}) => {
    const token = await getStoredToken(page);
    expect(token).toBeNull();
});

test('logout redirects to homepage', async ({page, loggedInPage}) => {
    await new NavbarComponent(page).logout();
    await expect(page).toHaveURL(env.BASE_URL);
});

test('logged out user can visit login page', screenshotSelector('.auth-page'),
    async ({page, loggedOutPage}) => {
        await new NavbarComponent(page).navigateToLogin();
        await expect(page).toHaveURL(LoginPage.PATH);
    });

test('user can log back in after logout', screenshotSelector('nav'),
    async ({page, loggedOutPage}) => {
        await new NavbarComponent(page).navigateToLogin();
        const loginPage = new LoginPage(page);
        await loginPage.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        await page.waitForURL(env.BASE_URL);
        await page.waitForSelector('.navbar-user-btn');
        await new NavbarComponent(page).expectLoggedInUI();
    });
