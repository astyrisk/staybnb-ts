import { apiTest as test, expect } from '../../../fixtures';
import { env } from '../../env';
import { validUser } from '../../data/users';

test('valid registration returns 201 with a JWT token and user object', async ({ authApi }) => {
    const user = validUser();
    const response = await authApi.register(user.firstName, user.lastName, user.email, user.password);
    await authApi.expectRegisterSuccess(response);
});

test('duplicate email returns DUPLICATE', async ({ authApi }) => {
    const user = validUser();
    const response = await authApi.register(user.firstName, user.lastName, env.HOST_USER_EMAIL, user.password);
    await authApi.expectDuplicateEmail(response);
});

test.describe('field validation', () => {
    let user: ReturnType<typeof validUser>;

    test.beforeEach(() => {
        user = validUser();
    });

    test('missing first name returns VALIDATION_ERROR', async ({ authApi }) => {
        const response = await authApi.register('', user.lastName, user.email, user.password);
        await authApi.expectValidationError(response);
    });

    test('missing last name returns VALIDATION_ERROR', async ({ authApi }) => {
        const response = await authApi.register(user.firstName, '', user.email, user.password);
        await authApi.expectValidationError(response);
    });

    test('missing email returns VALIDATION_ERROR', async ({ authApi }) => {
        const response = await authApi.register(user.firstName, user.lastName, '', user.password);
        await authApi.expectValidationError(response);
    });

    test('missing password returns VALIDATION_ERROR', async ({ authApi }) => {
        const response = await authApi.register(user.firstName, user.lastName, user.email, '');
        await authApi.expectValidationError(response);
    });

    test('weak password returns VALIDATION_ERROR', async ({ authApi }) => {
        const response = await authApi.register(user.firstName, user.lastName, user.email, 'short');
        await authApi.expectValidationError(response);
    });
});
