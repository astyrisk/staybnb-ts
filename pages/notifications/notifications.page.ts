import {BasePage} from "../base.page";
import {expect, Page} from "@playwright/test";
import {env} from "../../support/env";
import {Booking} from "../../support/data/bookings";

export class NotificationsPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/notifications";

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(NotificationsPage.PATH);
    }

    async expectBookingNotification(booking: Booking) {
        await this.page.locator('.notification-card').first().waitFor({ state: 'visible' });
        await expect(
            this.page.locator(`.notifications-list a[href*="/bookings/${booking.bookingID}"] .notification-title`,)
                .filter({ hasText: 'New booking request' })
                .first()
        ).toBeVisible();
    }
}
