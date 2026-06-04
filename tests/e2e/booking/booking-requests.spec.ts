import { seededProperty } from '../../../support/data/properties';
import { test, guestAuthFile } from '../../../fixtures';
import { Booking } from '../../../support/data/bookings';

test.describe('storageState/loggedIn as guest/booking-requests', () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({ pages }, testInfo) => {
        testInfo.annotations.push({ type: 'screenshot-selector', description: '.host-booking-card' });
        booking = undefined;
        await pages.propertyDetailsPage.goto(seededProperty.id);
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
    });

    test('Pending booking request is visible to the host', async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.expectPendingBookingVisible(seededProperty.title);
    });

    test('Host confirming a booking moves it to the Confirmed tab', async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.confirmBookingByProperty(seededProperty.title);
        await hostPages.bookingRequestsPage.expectBookingInConfirmedTab(seededProperty.title);
    });

    test("Guest's booking shows CONFIRMED status in upcoming after host confirms", async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.confirmBookingByProperty(seededProperty.title);
        await pages.myBookingPage.goto();
        await pages.myBookingPage.expectBookingConfirmedInUpcoming(booking!);
    });

    test('Host declining a booking removes it from the pending tab', async ({ hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.declineBookingByProperty(seededProperty.title);
        await hostPages.bookingRequestsPage.expectNoPendingBookingForProperty(seededProperty.title);
        booking = undefined;
    });

    test("Guest's booking shows DECLINED status after host declines", async ({ pages, hostPages }) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.declineBookingByProperty(seededProperty.title);
        await pages.myBookingPage.expectBookingDeclined(booking!);
        booking = undefined;
    });

    test.afterEach(async ({ pages }) => {
        if (booking?.bookingID) {
            await pages.myBookingPage.cancelBooking(booking);
        }
    });
});