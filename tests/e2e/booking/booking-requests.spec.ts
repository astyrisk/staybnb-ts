import { seededProperty } from '../../../support/data/properties';
import { test, screenshotSelector, guestAuthFile } from '../../../fixtures';
import { Booking } from '../../../support/data/bookings';

test.describe.configure({ mode: 'serial' });

test.describe('booking requests', () => {
    test.use({ storageState: guestAuthFile });
    let booking: Booking | undefined;

    test.beforeEach(async ({ pages }) => {
        booking = await pages.propertyDetailsPage.bookSeededProperty();
    });

    test.afterEach(async ({ pages }) => {
        if (booking) await pages.myBookingPage.cancelBooking(booking);
    });

    test('Pending booking request is visible to the host', screenshotSelector('.host-booking-card'), async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.expectPendingBookingVisible(seededProperty.title);
    });

    test('Host confirming a booking moves it to the Confirmed tab', screenshotSelector('.host-booking-card'), async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await hostPages.bookingRequestsPage.expectBookingInConfirmedTab(seededProperty.title);
    });

    test("Guest's booking shows CONFIRMED status in upcoming after host confirms", screenshotSelector('.host-booking-card'), async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.confirmBooking(seededProperty.title);
        await pages.myBookingPage.expectBookingConfirmedInUpcoming(booking!);
    });

    test('Host declining a booking removes it from the pending tab', screenshotSelector('.host-booking-card'), async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await hostPages.bookingRequestsPage.expectNoPendingBookingForProperty(seededProperty.title);
        booking = undefined;
    });

    test("Guest's booking shows DECLINED status after host declines", screenshotSelector('.host-booking-card'), async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.declineBooking(seededProperty.title);
        await pages.myBookingPage.expectBookingDeclined(booking!);
        booking = undefined;
    });
});
