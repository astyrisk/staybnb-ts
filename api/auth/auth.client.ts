import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const AUTH_BASE = `${env.API_BASE_URL}/auth`;

interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isHost: boolean;
    avatarUrl: string | null;
    createdAt: string;
}

interface AuthSuccessBody {
    user: AuthUser;
    token: string;
}

interface AuthErrorBody {
    error: { code: string; message: string };
}

export class AuthApiClient {
    constructor(private readonly request: APIRequestContext) {}

    login(email: string, password: string): Promise<APIResponse> {
        return this.request.post(`${AUTH_BASE}/login`, {
            data: { email, password },
        });
    }

    register(firstName: string, lastName: string, email: string, password: string): Promise<APIResponse> {
        return this.request.post(`${AUTH_BASE}/register`, {
            data: { firstName, lastName, email, password },
        });
    }

    async expectLoginSuccess(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(200);
        const body = await response.json() as AuthSuccessBody;
        expect(body.token).toBeTruthy();
        expect(body.user).toBeDefined();
    }

    async expectRegisterSuccess(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(201);
        const body = await response.json() as AuthSuccessBody;
        expect(body.token).toBeTruthy();
        expect(body.user).toBeDefined();
    }

    async expectValidationError(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(400);
        const body = await response.json() as AuthErrorBody;
        expect(body.error.code).toBe('VALIDATION_ERROR');
    }

    async expectInvalidCredentials(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(401);
        const body = await response.json() as AuthErrorBody;
        expect(body.error.code).toBe('INVALID_CREDENTIALS');
    }

    async expectDuplicateEmail(response: APIResponse): Promise<void> {
        expect(response.status()).toBe(409);
        const body = await response.json() as AuthErrorBody;
        expect(body.error.code).toBe('DUPLICATE');
    }
}
