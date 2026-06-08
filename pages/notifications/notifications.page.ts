import {BasePage} from "../base.page";
import {expect, Locator, Page} from "@playwright/test";
import {env} from "../../support/env";
import {Booking} from "../../support/data/bookings";

// TODO review the current page
export class NotificationsPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/notifications";

    readonly notificationCards: Locator = this.page.locator('.notification-card');
    readonly notificationList: Locator = this.page.locator('.notifications-list');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(NotificationsPage.PATH);
    }

    private notificationTitleFor(booking: Booking): Locator {
        return this.notificationList.locator(`a[href*="/bookings/${booking.bookingID}"] .notification-title`);
    }

    async expectBookingNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'New booking request' }).first()
        ).toBeVisible();
    }

    async expectCancellationNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking cancelled' }).first()
        ).toBeVisible();
    }

    async expectConfirmationNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking confirmed' }).first()
        ).toBeVisible();
    }

    async expectDeclineNotification(booking: Booking) {
        await this.goto();
        await this.notificationCards.first().waitFor({ state: 'visible' });
        await expect(
            this.notificationTitleFor(booking).filter({ hasText: 'Booking declined' }).first()
        ).toBeVisible();
    }
}