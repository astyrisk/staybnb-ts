import { apiTest as test } from '../../../fixtures';
import { BookingApiClient } from '../../../api/booking/booking.client';
import { validBookingPayload } from '../../../support/data/bookings';
import { validUser } from '../../../support/data/users';

test.describe('GET /bookings — guest booking list', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('returns pending bookings with pagination', async ({ guestBookingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-07-01', checkOut: '2027-07-03' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        const response = await guestBookingApi.getBookings('PENDING');
        await guestBookingApi.expectBookingsListed(response, 'PENDING');
    });
});

test.describe('GET /bookings/:id — booking detail', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('returns full booking detail for a valid booking', async ({ guestBookingApi }) => {
        const payload = validBookingPayload({ checkIn: '2027-07-05', checkOut: '2027-07-08' });
        const created = await guestBookingApi.createBooking(payload);
        const createdBody = await guestBookingApi.expectBookingCreated(created);
        bookingId = createdBody.id;

        const response = await guestBookingApi.getBookingById(bookingId);
        await guestBookingApi.expectBookingDetail(response, { id: bookingId, checkIn: payload.checkIn, checkOut: payload.checkOut });
    });

    test('returns 403 when booking belongs to another user', async ({ guestBookingApi, authApi, request }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-07-20', checkOut: '2027-07-22' })
        );
        const createdBody = await guestBookingApi.expectBookingCreated(created);
        bookingId = createdBody.id;

        const stranger = validUser();
        const registerResp = await authApi.register(stranger.firstName, stranger.lastName, stranger.email, stranger.password);
        const { token } = await authApi.expectRegisterSuccess(registerResp);
        const strangerApi = new BookingApiClient(request, token);

        const response = await strangerApi.getBookingById(bookingId);
        await strangerApi.expectForbidden(response);
    });
});

test.describe('PUT /bookings/:id/cancel — guest cancellation', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('cancels a PENDING booking', async ({ guestBookingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-08-01', checkOut: '2027-08-03' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);

        const response = await guestBookingApi.cancelBooking(body.id);
        await guestBookingApi.expectCancelled(response);
    });

    test('returns 403 when a different user attempts the cancellation', async ({ guestBookingApi, hostBookingApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-09-10', checkOut: '2027-09-12' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);
        bookingId = body.id;

        const response = await hostBookingApi.cancelBooking(bookingId);
        await hostBookingApi.expectForbidden(response);
    });

    test('host receives a BOOKING_CANCELLED notification after guest cancels', async ({ guestBookingApi, hostNotificationsApi }) => {
        const created = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-08-10', checkOut: '2027-08-12' })
        );
        const body = await guestBookingApi.expectBookingCreated(created);

        await guestBookingApi.cancelBooking(body.id);
        await hostNotificationsApi.expectNotificationExists('BOOKING_CANCELLED', body.id);
    });
});
