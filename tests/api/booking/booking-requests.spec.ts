import { apiTest as test } from '../../../fixtures';
import { validBookingPayload } from '../../../support/data/bookings';

test.describe('GET /hosting/bookings', () => {
    test('returns 403 for a non-host user', async ({ guestHostingApi }) => {
        const response = await guestHostingApi.getBookings();
        await guestHostingApi.expectForbidden(response);
    });
});

test.describe('PUT /hosting/bookings/:id/confirm — host confirms booking', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('confirms a PENDING booking', async ({ guestBookingApi, hostingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-11-01', checkOut: '2027-11-03' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        const response = await hostingApi.confirmBooking(bookingId);
        await hostingApi.expectConfirmed(response);
    });

    test('returns 403 when a non-host attempts to confirm', async ({ guestBookingApi, guestHostingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-11-10', checkOut: '2027-11-12' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        const response = await guestHostingApi.confirmBooking(bookingId);
        await guestHostingApi.expectForbidden(response);
    });

    test('guest receives a BOOKING_CONFIRMED notification after host confirms', async ({ guestBookingApi, hostingApi, guestNotificationsApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-12-10', checkOut: '2027-12-12' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        await hostingApi.confirmBooking(bookingId);
        await guestNotificationsApi.expectNotificationExists('BOOKING_CONFIRMED', bookingId);
    });
});

test.describe('PUT /hosting/bookings/:id/decline — host declines booking', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('declines a PENDING booking', async ({ guestBookingApi, hostingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-11-15', checkOut: '2027-11-17' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);

        const response = await hostingApi.declineBooking(body.id);
        await hostingApi.expectDeclined(response);
    });

    test('returns 403 when a non-host attempts to decline', async ({ guestBookingApi, guestHostingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-11-25', checkOut: '2027-11-27' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        const response = await guestHostingApi.declineBooking(bookingId);
        await guestHostingApi.expectForbidden(response);
    });

    test('guest receives a BOOKING_DECLINED notification after host declines', async ({ guestBookingApi, hostingApi, guestNotificationsApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-12-05', checkOut: '2027-12-07' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);

        await hostingApi.declineBooking(body.id);
        await guestNotificationsApi.expectNotificationExists('BOOKING_DECLINED', body.id);
    });
});
