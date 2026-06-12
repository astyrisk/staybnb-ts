import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const BOOKING_BASE = `${env.API_BASE_URL}/bookings`;

export interface CreateBookingPayload {
    propertyId?: number | string;
    checkIn?: string;
    checkOut?: string;
    numGuests?: number;
}

interface BookingsListBody {
    bookings: BookingBody[];
    pagination: unknown;
}

export interface BookingBody {
    id: number;
    property_id: number;
    guest_id: number;
    check_in: string;
    check_out: string;
    num_guests: number;
    total_price: number;
    status: string;
    created_at: string;
    property_title: string;
    property_city: string;
    property_country: string;
    [key: string]: unknown;
}

export class BookingApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    createBooking(payload: CreateBookingPayload): Promise<APIResponse> {
        return this.request.post(BOOKING_BASE, {
            data: payload,
            headers: this.headers(),
        });
    }

    createBookingUnauthenticated(payload: CreateBookingPayload): Promise<APIResponse> {
        return this.request.post(BOOKING_BASE, { data: payload });
    }

    getBookings(status?: string): Promise<APIResponse> {
        return this.request.get(BOOKING_BASE, {
            params: status ? { status } : {},
            headers: this.headers(),
        });
    }

    getBookingById(id: number | string): Promise<APIResponse> {
        return this.request.get(`${BOOKING_BASE}/${id}`, {
            headers: this.headers(),
        });
    }

    cancelBooking(id: number | string): Promise<APIResponse> {
        return this.request.put(`${BOOKING_BASE}/${id}/cancel`, {
            headers: this.headers(),
        });
    }

    async expectBookingCreated(response: APIResponse, payload?: CreateBookingPayload): Promise<BookingBody> {
        expect(response.status()).toBe(201);
        const body = await response.json() as BookingBody;
        expect(body.id).toBeDefined();
        expect(body.status).toBe('PENDING');
        expect(body.total_price).toBeDefined();
        expect(body.property_title).toBeDefined();
        expect(body.created_at).toBeDefined();
        if (payload) {
            expect(body.property_id).toBe(payload.propertyId);
            expect(body.check_in).toBe(payload.checkIn);
            expect(body.check_out).toBe(payload.checkOut);
            expect(body.num_guests).toBe(payload.numGuests);
        }
        return body;
    }

    async expectBookingsListed(response: APIResponse, status?: string): Promise<BookingsListBody> {
        expect(response.status()).toBe(200);
        const body = await response.json() as BookingsListBody;
        expect(Array.isArray(body.bookings)).toBe(true);
        expect(body.pagination).toBeDefined();
        if (status) {
            expect(body.bookings.every(b => b.status === status)).toBe(true);
        }
        return body;
    }

    async expectBookingDetail(response: APIResponse, payload?: { id?: number; checkIn?: string; checkOut?: string }): Promise<BookingBody> {
        expect(response.status()).toBe(200);
        const body = await response.json() as BookingBody;
        expect(body.total_price).toBeDefined();
        expect(body.status).toBeDefined();
        if (payload?.id !== undefined) expect(body.id).toBe(payload.id);
        if (payload?.checkIn) expect(body.check_in).toBe(payload.checkIn);
        if (payload?.checkOut) expect(body.check_out).toBe(payload.checkOut);
        return body;
    }

    async expectConflict(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(409);
    }

    async expectCancelled(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('CANCELLED');
    }

    async expectValidationError(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(400);
    }

    async expectUnauthorized(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(401);
    }

    async expectForbidden(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(403);
    }

    async expectNotFound(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(404);
    }
}
