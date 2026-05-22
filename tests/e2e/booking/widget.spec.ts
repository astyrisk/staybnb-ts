import { expect, test, screenshotSelector } from "../../../fixtures";
import {seededProperty} from 'support/data/properties'
import { guestAuthFile } from '../../../support/auth-files';

test.describe("storageState/loggedIn/widget UI", () => {
  test.beforeEach(async ({pages}, testInfo) => {
    testInfo.annotations.push({type: 'screenshot-selector', description: '.booking-widget'});
    await pages.propertyDetailsPage.goto(seededProperty.id);
  });

  test("Booking widget is displayed", async ({ pages }) => {
    await pages.propertyDetailsPage.expectBookingWidgetDisplayed();
  });

  test("Price breakdown is displayed after valid checkin and checkout dates are selected", async ({pages}) => {
    await pages.propertyDetailsPage.selectStayDates(0, 4);
    await pages.propertyDetailsPage.expectPriceBreakdownDisplayed(seededProperty.pricePerNight, 4);
  });

  test("Increment button is disabled after reaching property's max guest capacity", async ({pages}) => {
    await pages.propertyDetailsPage.incrementGuests(seededProperty.maxGuests);
    await pages.propertyDetailsPage.expectIncrementButtonDisable();
  });
});

test.describe("unauthenticated/no storageState", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Clicking reserve without authentication redirects to login", async ({pages}) => {
    await pages.propertyDetailsPage.selectStayDates(0, 4);
    await pages.propertyDetailsPage.clickOnReserveButton();
    await pages.propertyDetailsPage.expectRedirectToLoginPage();
  });

});

test.describe("storageState/loggedIn as guest/widget", () => {
  test.use({ storageState: guestAuthFile });

  test.beforeEach(async ({pages}, testInfo) => {
    testInfo.annotations.push({type: 'screenshot-selector', description: '.booking-widget'});
    await pages.propertyDetailsPage.goto(seededProperty.id);
  });

  test("Reserving a valid property gets it into guest's booking tab", async ({pages}) => {
    await pages.propertyDetailsPage.selectStayDates(0, 4);
    // TODO a booking object should has proper Booking type
    /* const booking = await pages.propertyDetailsPage.clickOnReserveButton(); */
    await pages.propertyDetailsPage.clickOnReserveButton();
    await pages.myBookingPage.expectBookingInUpcomingBookings()

    // await pages.propertyDetailsPage.expectReserveInBookingTab();
  });

  test("Reserving a valid property sends a notification to the host", async ({pages}) => {
    await pages.propertyDetailsPage.selectStayDates(0, 4);
    await pages.propertyDetailsPage.clickOnReserveButton();
    // TODO login with the new context page of the host, then run the expect -PS: maybe we should use different contexts of host and guest
    // await pages.propertyDetailsPage.expectReserveInNotifcation();
    // tear-up the reserve & the login
  });
});

