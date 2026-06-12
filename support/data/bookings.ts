import { seededProperty } from './properties';

export interface Booking {
    bookingID: string;
}

const addDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const toDateString = (date: Date): string => date.toISOString().split('T')[0];

const defaultBookingPayload = () => ({
    propertyId: Number(seededProperty.id),
    checkIn: toDateString(addDays(new Date(), 30)),
    checkOut: toDateString(addDays(new Date(), 33)),
    numGuests: 2,
});

export type BookingPayload = ReturnType<typeof defaultBookingPayload>;

export const validBookingPayload = (overrides: Partial<BookingPayload> = {}): BookingPayload => ({
    ...defaultBookingPayload(),
    ...overrides,
});