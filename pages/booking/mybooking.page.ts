import {BasePage} from "../base.page";
import {Page} from "@playwright/test";
import {env} from "../../support/env";

export class BookingPage extends BasePage {
    static readonly PATH = env.BASE_URL + "/booking";

    constructor(page: Page) {
        super(page);
    }

    async goto() {
        await this.page.goto(BookingPage.PATH);
    }

    getUpcomingBookings() {
    }

    async expectBookingInUpcomingBookings(/*booking : Booking */) {
        /* returns if a certain booking exists in  getUpcomingBooking */
    }

    inUpcomingBookings() {
    }

    getCancelledBookings() {
    }

    getCancelledBooking() {
    }
}

