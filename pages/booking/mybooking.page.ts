import {BasePage} from "../base.page";
import {expect, Page} from "@playwright/test";
import {env} from "../../support/env";
import {Booking} from "../../support/data/bookings";
import {getStoredToken} from "../../utils/session";


export class BookingPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/bookings";

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(BookingPage.PATH);
    }

    async getUpcomingBookingsViaUI(): Promise<Booking[]> {
        const cards = this.page.locator('.booking-card');
        const count = await cards.count();
        const bookings: Booking[] = [];

        for (let i = 0; i < count; i++) {
            const href = await cards.nth(i).getAttribute('href') ?? '';
            bookings.push({ bookingID: href.split('/').pop() ?? '' });
        }
        return bookings;
    }
    async getUpcomingBookingsViaAPI(): Promise<Booking[]> {
        const token = await getStoredToken(this.page);
        const response = await this.page.request.get(`${env.API_BASE_URL}/bookings`, {
            params: { status: 'PENDING' },
            headers: { Authorization: `Bearer ${token}` },
        });
        const { bookings } = await response.json();
        return bookings.map((b: { id: number }) => ({ bookingID: String(b.id) }));
    }

    async expectBookingInUpcomingBookings(booking: Booking) {
        await this.page.locator('.booking-card').first().waitFor({ state: 'visible' });
        const bookings = await this.getUpcomingBookingsViaUI();
        expect(bookings.some(b => b.bookingID === booking.bookingID)).toBe(true);
    }

    async cancelBooking(booking: Booking) {
        const token = await getStoredToken(this.page);
        await this.page.request.put(`${env.API_BASE_URL}/bookings/${booking.bookingID}/cancel`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async cancelBookingInUpcomingBookings(booking: Booking) {
    }

    inUpcomingBookings() {
    }

    getCancelledBookings() {
    }

    getCancelledBooking() {
    }
}

