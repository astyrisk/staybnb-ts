import { Page } from '@playwright/test';
import { LoginPage } from './auth/login.page';
import { RegisterPage } from './auth/register.page';
import { NavbarComponent } from './components/navbar.component';

export class PageManager {
    readonly loginPage: LoginPage;
    readonly registerPage: RegisterPage;
    readonly navbar: NavbarComponent;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.registerPage = new RegisterPage(page);
        this.navbar = new NavbarComponent(page);
    }
}
