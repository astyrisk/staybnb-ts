import {BasePage} from "../base.page";
import {expect, Locator, Page} from "@playwright/test";
import {env} from "../../support/env";
import {LoginPage} from "../auth/login.page";
import {Booking} from "../../support/data/bookings";

export class PropertyDetailsPage extends BasePage {
    static PATH = env.BASE_URL + "/properties/";

    // locators
    readonly bookingWidget: Locator = this.page.locator('.booking-widget');
    readonly checkInButton: Locator = this.page.getByRole("button", {name: "Check-in"});
    readonly checkOutButton: Locator = this.page.getByRole("button", {name: "Checkout"});
    readonly priceBreakdown: Locator = this.page.locator('.booking-widget__breakdown');

    readonly incrementButton: Locator =  this.page.getByRole('button', {name: '+'});
    readonly decrementButton: Locator = this.page.getByRole("button", {name: "-"});
    readonly reserveButton: Locator = this.page.getByRole("button", {name: "Reserve"});

    readonly selectedGuests: Locator = this.page.locator(".booking-widget__guests-value");

    constructor(page: Page) {
        super(page);
    }

    async goto(id: string) {
        await this.page.goto(PropertyDetailsPage.PATH + id);
    }

    async openCheckInPicker() {
        await this.checkInButton.click();
    }

    async selectNthAvailableDate(index: number) {
        await this.page.locator('.date-picker-day:enabled').nth(index).click();
    }

    async clickOnReserveButton(): Promise<Booking> {
        const responsePromise = this.page.waitForResponse(
            r => r.url().includes('/bookings') && r.request().method() === 'POST'
        );
        await this.reserveButton.click();
        const data = await (await responsePromise).json();
        return { bookingID: String(data.id) };
    }

    async selectStayDates(checkInIndex: number, checkOutIndex: number) {
        await this.openCheckInPicker();
        await this.selectNthAvailableDate(checkInIndex);
        await this.selectNthAvailableDate(checkOutIndex);
    }

    async incrementGuests(maxGuests: number) {
        for (let i = 0; i < maxGuests - 1; i++) {
            await this.incrementButton.click();
        }
    }

    // EXPECT
    async expectBookingWidgetDisplayed() {
        await expect(this.bookingWidget).toBeVisible();
    }

    async expectPriceBreakdownDisplayed(nightlyRate: number, nights: number) {
        const subtotal = nightlyRate * nights;
        // TODO is it good to do this kind of assertion?
        console.log(await this.priceBreakdown.textContent());
        await expect(this.priceBreakdown).toContainText(`$${nightlyRate} × ${nights} nights$${subtotal}Total$${subtotal}`);
    }

    async expectIncrementButtonDisable() {
        await expect(this.incrementButton).toBeDisabled();
    }

    async expectRedirectToLoginPage() {
        await this.page.waitForURL(LoginPage.PATH);
        expect(await this.getCurrentUrl()).toContain("login");
    }
}