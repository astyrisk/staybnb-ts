import { test, screenshotSelector, guestAuthFile } from '../../../fixtures';
import { Booking } from '../../../support/data/bookings';

test.describe.configure({ mode: 'serial' });

test.describe('my bookings', () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({ pages }) => {
        booking = await pages.propertyDetailsPage.bookSeededProperty();
    });

    test.afterEach(async ({ pages }) => {
        if (booking) await pages.myBookingPage.cancelBooking(booking);
    });

    test("Reserving a valid property appears in upcoming bookings", screenshotSelector('.booking-card'), async ({ pages }) => {
        await pages.myBookingPage.expectBookingInUpcomingBookings(booking!);
    });

    test("Cancelling a reservation moves it to the cancelled tab", screenshotSelector('.booking-card'), async ({ pages }) => {
        await pages.myBookingPage.cancelBooking(booking!);
        await pages.myBookingPage.expectBookingInCancelledBookings(booking!);
        booking = undefined;
    });
});
