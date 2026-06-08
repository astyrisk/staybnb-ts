import {BasePage} from "../base.page";
import {expect, Locator, Page} from "@playwright/test";
import {env} from "../../support/env";
import {LoginPage} from "../auth/login.page";
import {Booking} from "../../support/data/bookings";

import {seededProperty} from '../../support/data/properties';

export class PropertyDetailsPage extends BasePage {
    static PATH = env.BASE_URL + "/properties/";

    // selectors
    private readonly bookingWidgetSelector = '.booking-widget';
    private readonly priceBreakdownSelector = '.booking-widget__breakdown';
    private readonly selectedGuestsSelector = '.booking-widget__guests-value';
    private readonly datePickerDaySelector = '.date-picker-day:enabled';

    // locators
    readonly bookingWidget: Locator = this.page.locator(this.bookingWidgetSelector);
    readonly checkInButton: Locator = this.page.getByRole("button", {name: "Check-in"});
    readonly checkOutButton: Locator = this.page.getByRole("button", {name: "Checkout"});
    readonly priceBreakdown: Locator = this.page.locator(this.priceBreakdownSelector);

    readonly incrementButton: Locator = this.page.locator('.booking-widget').getByRole('button', {name: '+', exact: true});
    readonly decrementButton: Locator = this.page.getByRole("button", {name: "-"});
    readonly reserveButton: Locator = this.page.getByRole("button", {name: "Reserve"});

    readonly selectedGuests: Locator = this.page.locator(this.selectedGuestsSelector);

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
        await this.page.locator(this.datePickerDaySelector).nth(index).click();
    }

    async selectStayDates(checkInIndex: number, checkOutIndex: number) {
        await this.openCheckInPicker();
        await this.selectNthAvailableDate(checkInIndex);
        await this.selectNthAvailableDate(checkOutIndex);
    }

    async clickReserve() {
        await this.reserveButton.click();
    }

    async clickOnReserveButton(): Promise<Booking> {
        const responsePromise = this.page.waitForResponse(
            r => r.url().includes('/bookings') && r.request().method() === 'POST'
        );
        await this.reserveButton.click();
        const response = await responsePromise;
        const data = await response.json();
        if (!response.ok()) {
            throw new Error(`Booking failed (${response.status()}): ${JSON.stringify(data)}`);
        }
        return { bookingID: String(data.id) };
    }

    async bookSeededProperty(): Promise<Booking> {
        await this.goto(seededProperty.id);
        await this.selectStayDates(0, 4);
        return await this.clickOnReserveButton();
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
        await this.page.waitForURL(url => url.pathname.endsWith('/login') && url.searchParams.has('redirect'));
        expect(this.page.url()).toContain('login');
        expect(this.page.url()).toContain('redirect=');
    }
}
