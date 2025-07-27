export declare enum NotificationType {
    BOOKING_CREATED = "booking_created",
    BOOKING_ACCEPTED = "booking_accepted",
    BOOKING_COMPLETED = "booking_completed",
    BOOKING_CANCELLED = "booking_cancelled",
    PAYMENT_SUCCESS = "payment_success",
    PAYMENT_FAILED = "payment_failed",
    GENERAL = "general"
}
export declare class SendNotificationDto {
    title: string;
    body: string;
    userId: string;
    type?: NotificationType;
    data?: Record<string, string>;
    imageUrl?: string;
}
export declare class SendBulkNotificationDto {
    title: string;
    body: string;
    userIds: string[];
    type?: NotificationType;
    data?: Record<string, string>;
    imageUrl?: string;
}
