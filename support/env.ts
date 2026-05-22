const required = (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env key: ${key}`);
    return value;
};

export const env = {
    BASE_URL: required('BASE_URL'),
    API_BASE_URL: required('API_BASE_URL'),
    API_KEY: required('API_KEY'),
    HOST_USER_EMAIL: required('HOST_USER_EMAIL'),
    HOST_USER_PASSWORD: required('HOST_USER_PASSWORD'),
    GUEST_USER_EMAIL: required('GUEST_USER_EMAIL'),
    GUEST_USER_PASSWORD: required('GUEST_USER_PASSWORD'),
}
