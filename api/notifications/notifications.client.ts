import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { env } from '../../support/env';

const NOTIFICATIONS_BASE = `${env.API_BASE_URL}/notifications`;

interface Notification {
    id: number;
    type: string;
    reference_type: string;
    reference_id: number;
    is_read: boolean;
    title: string;
    message: string;
}

interface NotificationsBody {
    notifications: Notification[];
    unreadCount: number;
}

export class NotificationsApiClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string,
    ) {}

    private headers() {
        return { Authorization: `Bearer ${this.token}` };
    }

    getNotifications(): Promise<APIResponse> {
        return this.request.get(NOTIFICATIONS_BASE, {
            headers: this.headers(),
        });
    }

    async findNotification(type: string, referenceId: number): Promise<Notification | undefined> {
        const response = await this.getNotifications();
        const body = await response.json() as NotificationsBody;
        return body.notifications?.find(n => n.type === type && n.reference_id === referenceId);
    }

    async expectNotificationExists(type: string, referenceId: number): Promise<void> {
        const notification = await this.findNotification(type, referenceId);
        expect(notification, `Expected notification of type ${type} for booking ${referenceId}`).toBeDefined();
        expect(notification?.reference_type).toBe('booking');
        expect(notification?.is_read).toBe(false);
    }
}
