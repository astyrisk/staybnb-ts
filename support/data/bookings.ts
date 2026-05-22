const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export const validBooking = (overrides = {}) => ({
    checkIn: addDays(new Date(), 7),
    checkOut: addDays(new Date(), 10),
    guests: 2,
    ...overrides,
});