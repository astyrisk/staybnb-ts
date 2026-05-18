import { test as base } from '@playwright/test';
import { AuthApiClient } from '../api/auth/auth.client';

export const test = base.extend<{ authApi: AuthApiClient }>({
    authApi: async ({ request }, use) => {
        await use(new AuthApiClient(request));
    },
});
