import {expect, Locator, Page} from '@playwright/test';
import {BasePage} from "../base.page";
import {env} from "../../support/env";

export class RegisterPage extends BasePage {
    static readonly PATH = env.BASE_URL + '/register';

    readonly firstNameInput: Locator = this.page.getByLabel('First name');
    readonly lastNameInput: Locator = this.page.getByLabel('Last name');
    readonly emailInput: Locator = this.page.getByLabel('Email');
    readonly passwordInput: Locator = this.page.getByLabel('Password', {exact: true});
    readonly confirmPasswordInput: Locator = this.page.getByLabel('Confirm password');
    readonly submitButton: Locator = this.page.getByRole('button', {name: 'Register'});

    readonly firstNameError: Locator = this.page.locator('.form-group').filter({has: this.page.getByLabel('First name')}).locator('.field-error');
    readonly lastNameError: Locator = this.page.locator('.form-group').filter({has: this.page.getByLabel('Last name')}).locator('.field-error');
    readonly emailError: Locator = this.page.locator('.form-group').filter({has: this.page.getByLabel('Email')}).locator('.field-error');
    readonly passwordError: Locator = this.page.locator('.form-group').filter({has: this.page.getByLabel('Password')}).locator('.field-error');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(RegisterPage.PATH);
    }

    async register(firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.submitButton.click();
    }

    async expectRedirectToHomepage() {
        await expect(this.page).toHaveURL(env.BASE_URL);
    }

    async expectFirstNameRequired() {
        await expect(this.firstNameError).toContainText('First name is required');
    }

    async expectLastNameRequired() {
        await expect(this.lastNameError).toContainText('Last name is required');
    }

    async expectEmailRequired() {
        await expect(this.emailError).toContainText('Email is required');
    }

    async expectPasswordRequired() {
        await expect(this.passwordError).toContainText('Password is required');
    }

    async expectPasswordMismatchError() {
        await expect(this.passwordError).toContainText('Passwords do not match');
    }

    async expectWeakPasswordError() {
        await expect(this.passwordError).toContainText('at least 8 characters');
    }

    async expectEmailAlreadyExistsError() {
        await expect(this.page.locator('.auth-error')).toContainText('already');
    }
}
