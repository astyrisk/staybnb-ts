export interface Booking {
    bookingID: string;
}

const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

// TODO tf does the following do?
export const validBooking = (overrides = {}) => ({
    checkIn: addDays(new Date(), 7),
    checkOut: addDays(new Date(), 10),
    guests: 2,
    ...overrides,
});