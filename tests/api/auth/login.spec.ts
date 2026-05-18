import { apiTest as test } from '../../../fixtures';
import { env } from '../../env';
import { validUser } from '../../data/users';

test('valid credentials return 200 with a JWT token and user object', async ({ authApi }) => {
    const response = await authApi.login(env.HOST_USER_EMAIL, env.HOST_USER_PASSWORD);
    await authApi.expectLoginSuccess(response);
});

test('wrong password returns INVALID_CREDENTIALS', async ({ authApi }) => {
    const response = await authApi.login(env.HOST_USER_EMAIL, 'wrong-password');
    await authApi.expectInvalidCredentials(response);
});

test('unknown email returns INVALID_CREDENTIALS', async ({ authApi }) => {
    const user = validUser();
    const response = await authApi.login(user.email, user.password);
    await authApi.expectInvalidCredentials(response);
});

test('empty body returns VALIDATION_ERROR', async ({ authApi }) => {
    const response = await authApi.login('', '');
    await authApi.expectValidationError(response);
});