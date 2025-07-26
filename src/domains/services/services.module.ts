import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DatabaseModule } from '@/database/database.module';
import { LoggerService } from '@/common/services/logger.service';
import { ServiceRepository } from './repositories/services.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ServicesController],
  providers: [ServicesService, LoggerService, ServiceRepository],
  exports: [],
})
export class ServicesModule {}