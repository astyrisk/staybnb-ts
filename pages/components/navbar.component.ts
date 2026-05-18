import { expect, Locator, Page } from '@playwright/test';
import {BaseComponent} from "../base.component";
import {Selectors} from "../../support/data/selectors";

export class NavbarComponent extends BaseComponent {
    private readonly notificationBell: Locator = this.page.locator('.notification-bell');
    private readonly userButton: Locator = this.page.locator(Selectors.navbarUserBtn);
    private readonly loginLink: Locator = this.page.locator('a[href*="/login"]');
    private readonly logoutButton: Locator = this.page.getByRole('button', { name: 'Log out' });

    constructor(page: Page) {
        super(page);
    }

    async isLoggedIn(): Promise<boolean> {
        return this.userButton.isVisible();
    }

    async expectLoggedInUI() {
        await expect(this.notificationBell).toBeVisible();
        await expect(this.userButton).toBeVisible();
        await expect(this.loginLink).not.toBeVisible();
    }

    async expectLoggedOutUI() {
        await expect(this.loginLink).toBeVisible();
        await expect(this.userButton).not.toBeVisible();
    }

    async navigateToLogin(): Promise<void> {
        await this.loginLink.click();
    }

    async logout(): Promise<void> {
        await this.userButton.click()
        await this.logoutButton.click()
        await this.loginLink.waitFor({state: 'visible'});
    }
}
