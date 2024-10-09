import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashToolService } from "../../utils/hashtool.service"
import { DatabaseModule } from '../../database/database.module';
import { TriggerDatabaseModule } from 'apps/area-trigger/src/database/trigger_database.module';

@Module({
  imports: [DatabaseModule, TriggerDatabaseModule],
  providers: [UsersService, HashToolService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }