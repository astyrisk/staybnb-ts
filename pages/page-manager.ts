import { Page } from '@playwright/test';
import { LoginPage } from './auth/login.page';
import { RegisterPage } from './auth/register.page';
import { NavbarComponent } from './components/navbar.component';
import {PropertyDetailsPage} from "./property/property-details.page";
import {BookingPage} from "./booking/mybooking.page";

export class PageManager {
    readonly loginPage: LoginPage;
    readonly registerPage: RegisterPage;
    readonly navbar: NavbarComponent;
    readonly propertyDetailsPage: PropertyDetailsPage;
    readonly myBookingPage: BookingPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.registerPage = new RegisterPage(page);
        this.navbar = new NavbarComponent(page);
        this.propertyDetailsPage = new PropertyDetailsPage(page);
        this.myBookingPage = new BookingPage(page);
    }
}
