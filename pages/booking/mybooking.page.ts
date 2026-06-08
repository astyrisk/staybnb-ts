import {BasePage} from "../base.page";
import {expect, Locator, Page} from "@playwright/test";
import {env} from "../../support/env";
import {Booking} from "../../support/data/bookings";
import {getStoredToken} from "../../utils/session";

export class BookingPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/bookings";

    readonly bookingCards: Locator = this.page.locator('.booking-card');
    readonly cancelledTab: Locator = this.page.getByRole('button', { name: 'Cancelled' });
    readonly cancelledStatusBadge: Locator = this.page.locator('.booking-card__status--cancelled').first();
    readonly confirmedStatusBadge: Locator = this.page.locator('.booking-card__status--confirmed');
    readonly declinedStatusBadge: Locator = this.page.locator('.booking-detail__status--declined');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(BookingPage.PATH);
    }

    private async getBookingCardsFromUI(): Promise<Booking[]> {
        const count = await this.bookingCards.count();

        const bookings: Booking[] = [];
        for (let i = 0; i < count; i++) {
            const href = await this.bookingCards.nth(i).getAttribute('href') ?? '';
            bookings.push({ bookingID: href.split('/').pop() ?? '' });
        }
        return bookings;
    }

    async getUpcomingBookings(): Promise<Booking[]> {
        return this.getBookingCardsFromUI();
    }

    async getCancelledBookings(): Promise<Booking[]> {
        await this.goto();
        await this.cancelledTab.click();
        await this.cancelledStatusBadge.waitFor({ state: 'visible' });
        return this.getBookingCardsFromUI();
    }

    async expectBookingInUpcomingBookings(booking: Booking) {
        await this.goto();
        await expect(this.page.locator(`a.booking-card[href*="${booking.bookingID}"]`)).toBeVisible();
    }

    async expectBookingConfirmedInUpcoming(booking: Booking) {
        await this.goto();
        const card = this.page.locator(`a.booking-card[href*="${booking.bookingID}"]`);
        await expect(card.locator(this.confirmedStatusBadge)).toBeVisible();
    }

    async expectBookingInCancelledBookings(booking: Booking) {
        await this.goto();
        await this.cancelledTab.click();
        const card = this.page.locator(`a.booking-card[href*="${booking.bookingID}"]`);
        await expect(card.locator('.booking-card__status--cancelled')).toBeVisible();
    }

    async cancelBooking(booking: Booking) {
        const token = await getStoredToken(this.page);
        await this.page.request.put(`${env.API_BASE_URL}/bookings/${booking.bookingID}/cancel`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    // NOTE expect would check against ID if it could find it, otherwise it would check against the title as in booking-requests
    async expectBookingDeclined(booking: Booking) {
        await this.page.goto(`${BookingPage.PATH}/${booking.bookingID}`);
        await expect(this.declinedStatusBadge).toBeVisible();
    }
}