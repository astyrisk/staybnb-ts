import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const HOSTING_BASE = `${env.API_BASE_URL}/hosting/bookings`;

export class HostingApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    getBookings(status?: string): Promise<APIResponse> {
        return this.request.get(HOSTING_BASE, {
            params: status ? { status } : {},
            headers: this.headers(),
        });
    }

    confirmBooking(id: number | string): Promise<APIResponse> {
        return this.request.put(`${HOSTING_BASE}/${id}/confirm`, {
            headers: this.headers(),
        });
    }

    declineBooking(id: number | string): Promise<APIResponse> {
        return this.request.put(`${HOSTING_BASE}/${id}/decline`, {
            headers: this.headers(),
        });
    }

    async expectConfirmed(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('CONFIRMED');
    }

    async expectDeclined(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('DECLINED');
    }

    async expectValidationError(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(400);
    }

    async expectForbidden(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(403);
    }

    async expectNotFound(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(404);
    }
}
