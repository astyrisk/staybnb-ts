export const validUser = () => ({
    firstName: 'Test',
    lastName: 'User',
    email: `test+${crypto.randomUUID()}@example.com`,
    password: 'Password123',
});
