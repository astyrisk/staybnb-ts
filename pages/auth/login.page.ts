import {expect, Locator, Page} from '@playwright/test';
import {BasePage} from "../base.page";
import {env} from "../../support/env";
import {Selectors} from "../../support/data/selectors";

export class LoginPage extends BasePage {
    static readonly PATH = env.BASE_URL + '/login';

    readonly emailInput: Locator = this.page.getByLabel('Email');
    readonly passwordInput: Locator = this.page.getByLabel('Password');
    readonly submitButton: Locator = this.page.getByRole('button', {name: 'Log in'});
    readonly authErrorMessage: Locator = this.page.locator('.auth-error');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(LoginPage.PATH);
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async loginAsGuest() {
        await this.goto();
        await this.login(env.GUEST_USER_EMAIL, env.GUEST_USER_PASSWORD);
        await this.page.waitForSelector(Selectors.navbarUserBtn);
    }

    async loginAsHost() {
        await this.goto();
        await this.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
        await this.page.waitForSelector(Selectors.navbarUserBtn);
    }

    async expectInvalidEmailOrPasswordError() {
        await expect(this.authErrorMessage).toContainText('Invalid email or password');
    }

    async expectEmailAndPasswordAreRequired() {
        await expect(this.authErrorMessage).toContainText('Email and password are required');
    }

    async expectRedirectToHomepage() {
        const base = env.BASE_URL.replace(/\/+$/, '');
        await expect(this.page).toHaveURL(new RegExp(`^${base}/?(?:[?#]|$)`));
    }
}