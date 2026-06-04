import { BasePage } from '../base.page';
import { expect, Locator, Page } from '@playwright/test';
import { env } from '../../support/env';

export class BookingRequestsPage extends BasePage {
    static readonly PATH = env.BASE_URL + '/hosting/bookings';

    readonly confirmedTab: Locator = this.page.getByRole('button', { name: 'Confirmed' });
    readonly modal: Locator = this.page.locator('.modal');
    readonly modalConfirmBtn: Locator = this.page.locator('.modal__btn--confirm');
    readonly modalDeclineBtn: Locator = this.page.locator('.modal__btn--decline');
    readonly bookingCards: Locator = this.page.locator('.host-booking-card');
    readonly bookingCardDetailValue: Locator = this.page.locator('.host-booking-card__detail-value');
    readonly confirmBtn: Locator = this.page.locator('.host-booking-card__btn--confirm');
    readonly declineBtn: Locator = this.page.locator('.host-booking-card__btn--decline');
    readonly pendingStatusBadge: Locator = this.page.locator('.host-booking-card__status--pending');
    readonly confirmedStatusBadge: Locator = this.page.locator('.host-booking-card__status--confirmed');

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(BookingRequestsPage.PATH);
    }

    private cardByProperty(propertyTitle: string) {
        return this.bookingCards.filter({
            has: this.bookingCardDetailValue.filter({ hasText: propertyTitle }),
        }).first();
    }

    async confirmBookingByProperty(propertyTitle: string) {
        const card = this.cardByProperty(propertyTitle);
        await card.locator(this.confirmBtn).click();
        await this.modal.waitFor({ state: 'visible' });
        await this.modalConfirmBtn.click();
        await this.modal.waitFor({ state: 'hidden' });
    }

    async declineBookingByProperty(propertyTitle: string) {
        const card = this.cardByProperty(propertyTitle);
        await card.locator(this.declineBtn).click();
        await this.modal.waitFor({ state: 'visible' });
        await this.modalDeclineBtn.click();
        await this.modal.waitFor({ state: 'hidden' });
    }

    async expectPendingBookingVisible(propertyTitle: string) {
        const card = this.cardByProperty(propertyTitle);
        await expect(card.locator(this.pendingStatusBadge)).toBeVisible();
    }

    async expectBookingInConfirmedTab(propertyTitle: string) {
        await this.confirmedTab.click();
        const card = this.cardByProperty(propertyTitle);
        await expect(card.locator(this.confirmedStatusBadge)).toBeVisible();
    }

    async expectNoPendingBookingForProperty(propertyTitle: string) {
        const card = this.cardByProperty(propertyTitle);
        await expect(card).not.toBeVisible();
    }
}