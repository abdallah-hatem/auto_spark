export interface FirebaseConfig {
    projectId: string;
    privateKey: string;
    clientEmail: string;
    serviceAccountPath?: string;
}
export interface NotificationPayload {
    title: string;
    body: string;
    imageUrl?: string;
}
export interface NotificationData {
    [key: string]: string;
}
export interface FCMMessage {
    token: string;
    notification: NotificationPayload;
    data?: NotificationData;
    android?: {
        priority: 'high' | 'normal';
        notification: {
            sound: string;
            clickAction: string;
        };
    };
    apns?: {
        payload: {
            aps: {
                sound: string;
                'content-available': number;
            };
        };
    };
}
