import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { UsersModule } from '@/domains/users/users.module';
import { AuthModule } from '@/domains/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@/config/database.config';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { LoggerMiddleware } from '@/common/middleware/logger.middleware';
import { LoggerService } from '@/common/services/logger.service';
import { ServicesModule } from '@/domains/services/services.module';
import { CouponsModule } from '@/domains/coupons/coupons.module';
import { NotificationsModule } from '@/domains/notifications/notifications.module';
import { BookingModule } from './domains/booking/booking.module';
import { PaymentModule } from './domains/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ServicesModule,
    CouponsModule,
    NotificationsModule,
    BookingModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [
    DatabaseService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
