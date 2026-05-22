import path from 'path';

const authDir = path.resolve(__dirname, '../playwright/.auth');

export const hostAuthFile = path.join(authDir, 'host.json');
export const guestAuthFile = path.join(authDir, 'guest.json');
