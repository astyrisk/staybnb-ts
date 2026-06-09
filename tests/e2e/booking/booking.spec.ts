import { seededProperty } from '../../../support/data/properties';
import { test, screenshotSelector, guestAuthFile } from '../../../fixtures';

test.describe('my bookings', () => {
    test.use({ storageState: guestAuthFile });

    test("Reserving a valid property appears in upcoming bookings", screenshotSelector('.booking-card'), async ({ pages, bookedProperty }) => {
        await pages.myBookingPage.expectBookingInUpcomingBookings(bookedProperty);
    });

    test("Cancelling a reservation moves it to the cancelled tab", screenshotSelector('.booking-card'), async ({ pages, bookedProperty }) => {
        await pages.myBookingPage.cancelBooking(bookedProperty);
        await pages.myBookingPage.expectBookingInCancelledBookings(bookedProperty);
    });
});

test.describe('booking requests', () => {
    test.use({ storageState: guestAuthFile });

    test('Pending booking request is visible to the host', screenshotSelector('.host-booking-card'), async ({ hostPages, bookedProperty: _ }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.expectPendingBookingVisible(seededProperty.title);
    });

    test('Host confirming a booking moves it to the Confirmed tab', screenshotSelector('.host-booking-card'), async ({ hostPages, bookedProperty: _ }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await hostPages.bookingRequestsPage.expectBookingInConfirmedTab(seededProperty.title);
    });

    test("Guest's booking shows CONFIRMED status in upcoming after host confirms", screenshotSelector('.host-booking-card'), async ({ pages, hostPages, bookedProperty }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await pages.myBookingPage.expectBookingConfirmedInUpcoming(bookedProperty);
    });

    test('Host declining a booking removes it from the pending tab', screenshotSelector('.host-booking-card'), async ({ hostPages, bookedProperty: _ }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await hostPages.bookingRequestsPage.expectNoPendingBookingForProperty(seededProperty.title);
    });

    test("Guest's booking shows DECLINED status after host declines", screenshotSelector('.host-booking-card'), async ({ pages, hostPages, bookedProperty }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await pages.myBookingPage.expectBookingDeclined(bookedProperty);
    });
});

test.describe("notifications", () => {
    test.use({ storageState: guestAuthFile });

    test("Reserving a property notifies the host", screenshotSelector('.booking-widget'), async ({ hostPages, bookedProperty }) => {
        await hostPages.notificationsPage.expectBookingNotification(bookedProperty);
    });

    test("Cancelling a reservation notifies the host", screenshotSelector('.booking-widget'), async ({ pages, hostPages, bookedProperty }) => {
        await pages.myBookingPage.cancelBooking(bookedProperty);
        await hostPages.notificationsPage.expectCancellationNotification(bookedProperty);
    });

    test("Host confirming a booking notifies the guest", screenshotSelector('.notification-card'), async ({ pages, hostPages, bookedProperty }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await pages.notificationsPage.expectConfirmationNotification(bookedProperty);
    });

    test("Host declining a booking notifies the guest", screenshotSelector('.notification-card'), async ({ pages, hostPages, bookedProperty }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await pages.notificationsPage.expectDeclineNotification(bookedProperty);
    });
});
