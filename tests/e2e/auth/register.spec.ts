import {test, screenshotSelector} from "../../../fixtures";
import {env} from "../../env";
import {validUser} from "../../data/users";
import {Selectors} from "../../data/selectors";

test('successful registration redirects to homepage', async ({pages, registered}) => {
    await pages.registerPage.expectRedirectToHomepage();
});

test('user is logged in after registration', screenshotSelector('nav'),
    async ({pages, registered}) => {
        await pages.navbar.expectLoggedInUI();
    });

test.describe('form validation', () => {
    test.beforeEach(({}, testInfo) => {
        testInfo.annotations.push({type: 'screenshot-selector', description: 'form'});
    });

    test('first name is required', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register('', user.lastName, user.email, user.password, user.password);
        await pages.registerPage.expectFirstNameRequired();
    });

    test('last name is required', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, '', user.email, user.password, user.password);
        await pages.registerPage.expectLastNameRequired();
    });

    test('email is required', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, '', user.password, user.password);
        await pages.registerPage.expectEmailRequired();
    });

    test('password is required', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, user.email, '', '');
        await pages.registerPage.expectPasswordRequired();
    });

    test('mismatched passwords show error', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, user.email, user.password, 'different-password');
        await pages.registerPage.expectPasswordMismatchError();
    });

    test('password shorter than 8 characters is rejected', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, user.email, 'short', 'short');
        await pages.registerPage.expectWeakPasswordError();
    });

    test('registering with an existing email shows error', async ({pages}) => {
        const user = validUser();
        await pages.registerPage.goto();
        await pages.registerPage.register(user.firstName, user.lastName, env.HOST_USER_EMAIL, user.password, user.password);
        await pages.registerPage.expectEmailAlreadyExistsError();
    });
});

test('loggedIn user visiting register page redirects to homepage', screenshotSelector(Selectors.authPage),
    async ({pages, authenticated}) => {
        await pages.registerPage.goto();
        await pages.registerPage.expectRedirectToHomepage();
    });
