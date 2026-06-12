import { apiTest as test } from '../../../fixtures';
import { validBookingPayload } from '../../../support/data/bookings';
import { seededProperty } from '../../../support/data/properties';

test.describe('POST /bookings', () => {
    let bookingId: number | undefined;

    test.afterEach(async ({ guestBookingApi }) => {
        if (bookingId) {
            await guestBookingApi.cancelBooking(bookingId);
            bookingId = undefined;
        }
    });

    test('creates a booking with PENDING status and returns all required fields', async ({ guestBookingApi }) => {
        const payload = validBookingPayload({ checkIn: '2027-03-01', checkOut: '2027-03-04' });
        const response = await guestBookingApi.createBooking(payload);
        const body = await guestBookingApi.expectBookingCreated(response, payload);
        bookingId = body.id;
    });

    test('returns 401 when request is unauthenticated', async ({ guestBookingApi }) => {
        const response = await guestBookingApi.createBookingUnauthenticated(validBookingPayload());
        await guestBookingApi.expectUnauthorized(response);
    });

    test('returns 409 when dates overlap with an existing booking', async ({ guestBookingApi }) => {
        const first = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-05-01', checkOut: '2027-05-05' })
        );
        const body = await first.json();
        bookingId = body.id;

        const overlap = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-05-03', checkOut: '2027-05-07' })
        );
        await guestBookingApi.expectConflict(overlap);
    });

    test('returns 400 when numGuests exceeds property max guests', async ({ guestBookingApi }) => {
        const response = await guestBookingApi.createBooking(
            validBookingPayload({ numGuests: seededProperty.maxGuests + 1 })
        );
        await guestBookingApi.expectValidationError(response);
    });

    test('host receives a BOOKING_REQUEST notification after booking', async ({ guestBookingApi, hostNotificationsApi }) => {
        const response = await guestBookingApi.createBooking(
            validBookingPayload({ checkIn: '2027-06-15', checkOut: '2027-06-17' })
        );
        const body = await guestBookingApi.expectBookingCreated(response);
        bookingId = body.id;

        await hostNotificationsApi.expectNotificationExists('BOOKING_REQUEST', bookingId);
    });
});
