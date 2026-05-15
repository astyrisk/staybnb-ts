import {BrowserContext, expect, Locator, Page} from '@playwright/test';
import {BasePage} from "../base.page";
import {env} from "../../tests/env";

export class LoginPage extends BasePage {
    static readonly PATH = env.BASE_URL + '/login';

    readonly emailInput: Locator = this.page.getByLabel('Email');
    readonly passwordInput: Locator = this.page.getByLabel('Password');
    readonly submitButton: Locator  = this.page.getByRole('button', {name: 'Log in'});
    readonly authErrorMessage : Locator = this.page.locator('.auth-error');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(LoginPage.PATH);
    }

    async saveSession(context: BrowserContext) {
        await context.storageState({path: 'environments/session.json'});
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async expectInvalidEmailOrPasswordError() {
        await expect(this.authErrorMessage).toContainText('Invalid email or password');
    }

    async expectEmailAndPasswordAreRequired() {
        await expect(this.authErrorMessage).toContainText('Email and password are required');
    }

    async expectRateLimitError() {
        // TODO: replace with the actual rate limit message from the app
        await expect(this.authErrorMessage).toContainText('Too many attempts');
    }

    async expectRedirectToHomepage() {
        await expect(this.page).toHaveURL(env.BASE_URL);
    }
}