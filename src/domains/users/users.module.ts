import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from '@/database/database.module';
import { LoggerService } from '@/common/services/logger.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, LoggerService],
  exports: [UsersService],
})
export class UsersModule {}
