import { IsString, IsOptional, IsArray, IsObject, IsEnum } from 'class-validator';

export enum NotificationType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_ACCEPTED = 'booking_accepted',
  BOOKING_COMPLETED = 'booking_completed',
  BOOKING_CANCELLED = 'booking_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  GENERAL = 'general',
}

export class SendNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.GENERAL;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>; // Additional data for the notification

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class SendBulkNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.GENERAL;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;

  @IsOptional()
  @IsString()
  imageUrl?: string;
} 