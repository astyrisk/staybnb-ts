import { seededProperty } from "../../../support/data/properties";
import { test, screenshotSelector } from "../../../fixtures";
import { guestAuthFile } from "../../../fixtures";
import { Booking } from "../../../support/data/bookings";

test.describe.configure({ mode: 'serial' });

test.describe("notifications", () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({ pages }) => {
        booking = await pages.propertyDetailsPage.bookSeededProperty();
    });

    test.afterEach(async ({ pages }) => {
        if (booking) await pages.myBookingPage.cancelBooking(booking);
    });

    test("Reserving a property notifies the host", screenshotSelector('.booking-widget'), async ({ hostPages }) => {
        await hostPages.notificationsPage.expectBookingNotification(booking!);
    });

    test("Cancelling a reservation notifies the host", screenshotSelector('.booking-widget'), async ({ pages, hostPages }) => {
        await pages.myBookingPage.cancelBooking(booking!);
        await hostPages.notificationsPage.expectCancellationNotification(booking!);
        booking = undefined;
    });

    test("Host confirming a booking notifies the guest", screenshotSelector('.notification-card'), async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await pages.notificationsPage.expectConfirmationNotification(booking!);
    });

    test("Host declining a booking notifies the guest", screenshotSelector('.notification-card'), async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await pages.notificationsPage.expectDeclineNotification(booking!);
        booking = undefined;
    });
});
