import {expect, test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {RegisterPage} from "../../../pages/auth/register.page";
import {NavbarComponent} from "../../../pages/components/navbar.component";
import {validUser} from "../../data/users";
import {Selectors} from "../../data/selectors";

test('successful registration redirects to homepage', async ({registeredPage}) => {
    await registeredPage.expectRedirectToHomepage();
});

test('user is logged in after registration', screenshotSelector('nav'),
    async ({page, registeredPage}) => {
        await new NavbarComponent(page).expectLoggedInUI();
    });

test.describe('form validation', () => {
    test.beforeEach(({}, testInfo) => {
        testInfo.annotations.push({type: 'screenshot-selector', description: 'form'});
    });

    test('first name is required', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register('', user.lastName, user.email, user.password, user.password);
        await registerPage.expectFirstNameRequired();
    });

    test('last name is required', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, '', user.email, user.password, user.password);
        await registerPage.expectLastNameRequired();
    });

    test('email is required', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, '', user.password, user.password);
        await registerPage.expectEmailRequired();
    });

    test('password is required', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, user.email, '', '');
        await registerPage.expectPasswordRequired();
    });

    test('mismatched passwords show error', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, user.email, user.password, 'different-password');
        await registerPage.expectPasswordMismatchError();
    });

    test('password shorter than 8 characters is rejected', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, user.email, 'short', 'short');
        await registerPage.expectWeakPasswordError();
    });

    test('registering with an existing email shows error', async ({page}) => {
        const user = validUser();
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(user.firstName, user.lastName, env.HOST_USER_EMAIL, user.password, user.password);
        await registerPage.expectEmailAlreadyExistsError();
    });
});

test('loggedIn user visiting register page redirects to homepage', screenshotSelector(Selectors.authPage),
    async ({page, loggedInPage}) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page).toHaveURL(env.BASE_URL);
    });
