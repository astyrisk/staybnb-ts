import {seededProperty} from "../../../support/data/properties";
import {test, expect} from "../../../fixtures";
import {guestAuthFile} from "../../../fixtures";
import {Booking} from "../../../support/data/bookings";

test.describe("storageState/loggedIn as guest/notifications", () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({pages}, testInfo) => {
        testInfo.annotations.push({type: 'screenshot-selector', description: '.booking-widget'});
        booking = undefined;
        await pages.propertyDetailsPage.goto(seededProperty.id);
    });

    test("Reserving a valid property sends a notification to the host", async ({pages, hostPages}) => {
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
        await hostPages.notificationsPage.goto();
        await hostPages.notificationsPage.expectBookingNotification(booking);
    });

    test("cancelling a reserved booking sends a notification to the host", async ({pages, hostPages}) => {
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
        await pages.myBookingPage.cancelBooking(booking);
        await hostPages.notificationsPage.goto();
        await hostPages.notificationsPage.expectCancellationNotification(booking);
        booking = undefined;
    })

    test.afterEach(async ({pages}) => {
        if (booking?.bookingID) {
            await pages.myBookingPage.cancelBooking(booking);
        }
    });
});

test.describe("storageState/loggedIn as guest/host action notifications", () => {
    test.use({ storageState: guestAuthFile });

    let booking: Booking | undefined;

    test.beforeEach(async ({pages}, testInfo) => {
        testInfo.annotations.push({type: 'screenshot-selector', description: '.notification-card'});
        booking = undefined;
        await pages.propertyDetailsPage.goto(seededProperty.id);
        await pages.propertyDetailsPage.selectStayDates(0, 4);
        booking = await pages.propertyDetailsPage.clickOnReserveButton();
    });

    test("Host confirming a booking sends a confirmation notification to the guest", async ({pages, hostPages}) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.confirmBookingByProperty(seededProperty.title);
        await pages.notificationsPage.goto();
        await pages.notificationsPage.expectConfirmationNotification(booking!);
    });

    test("Host declining a booking sends a decline notification to the guest", async ({pages, hostPages}) => {
        await hostPages.bookingRequestsPage.goto();
        await hostPages.bookingRequestsPage.declineBookingByProperty(seededProperty.title);
        await pages.notificationsPage.goto();
        await pages.notificationsPage.expectDeclineNotification(booking!);
        booking = undefined;
    });

    test.afterEach(async ({pages}) => {
        if (booking?.bookingID) {
            await pages.myBookingPage.cancelBooking(booking);
        }
    });
});
