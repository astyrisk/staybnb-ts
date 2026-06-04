import {seededProperty} from "../../../support/data/properties";
import {test, expect} from "../../../fixtures";
import {guestAuthFile} from "../../../fixtures";
import {Booking} from "../../../support/data/bookings";

test.describe("storageState/loggedIn as guest/widget", () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({pages}, testInfo) => {
        testInfo.annotations.push({type: 'screenshot-selector', description: '.booking-widget'});
        booking = undefined;
        await pages.propertyDetailsPage.goto(seededProperty.id);
    });

    test("Reserving a valid property gets it into the user's my booking tab", async ({pages}) => {
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
        await pages.myBookingPage.goto();
        await pages.myBookingPage.expectBookingInUpcomingBookings(booking);
    });

    test("Cancelling a reserved property would send it to my bookings cancelled page", async ({pages}) => {
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
        await pages.myBookingPage.goto();
        await pages.myBookingPage.expectBookingInUpcomingBookings(booking);
        await pages.myBookingPage.cancelBooking(booking);
        await pages.myBookingPage.expectBookingInCancelledBookings(booking);
        booking = undefined;
    });

    test.afterEach(async ({pages}) => {
        if (booking?.bookingID) {
            await pages.myBookingPage.cancelBooking(booking);
        }
    });
});
