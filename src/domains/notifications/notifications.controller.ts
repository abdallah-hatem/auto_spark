import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto, SendBulkNotificationDto } from './dto/send-notification.dto';
import { Auth } from '@/domains/auth/decorators/auth.decorator';
import { IsAdmin } from '@/domains/auth/decorators/roles.decorator';
import { GetUser } from '@/domains/auth/decorators/get-user.decorator';
import { User } from '@/domains/users/entities/user.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @Auth()
  @IsAdmin()
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto): Promise<{ messageId: string }> {
    const messageId = await this.notificationsService.sendToUser(sendNotificationDto);
    return { messageId };
  }

  @Post('send-bulk')
  @Auth()
  @IsAdmin()
  async sendBulkNotification(@Body() sendBulkNotificationDto: SendBulkNotificationDto): Promise<any> {
    return this.notificationsService.sendToMultipleUsers(sendBulkNotificationDto);
  }

  @Post('send-to-role/:role')
  @Auth()
  @IsAdmin()
  async sendToRole(
    @Param('role') role: string,
    @Body() body: { title: string; body: string; data?: Record<string, string> }
  ): Promise<any> {
    return this.notificationsService.sendToUsersByRole(role, body.title, body.body, body.data);
  }

  @Put('device-token')
  @Auth()
  async updateDeviceToken(
    @GetUser() user: User,
    @Body() body: { deviceToken: string }
  ): Promise<{ message: string }> {
    await this.notificationsService.updateDeviceToken(user.id, body.deviceToken);
    return { message: 'Device token updated successfully' };
  }

  @Delete('device-token')
  @Auth()
  async removeDeviceToken(@GetUser() user: User): Promise<{ message: string }> {
    await this.notificationsService.removeDeviceToken(user.id);
    return { message: 'Device token removed successfully' };
  }

  // Test endpoint to send a test notification
  @Post('test')
  @Auth()
  async sendTestNotification(@GetUser() user: User): Promise<{ message: string }> {
    await this.notificationsService.sendToUser({
      userId: user.id,
      title: 'Test Notification 🧪',
      body: 'This is a test notification from AutoSpark!',
      data: { test: 'true' },
    });
    return { message: 'Test notification sent successfully' };
  }
} 