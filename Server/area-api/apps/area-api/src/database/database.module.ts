import { Module } from '@nestjs/common';
import { AreaDatabaseService, SingleAreaDatabaseService } from "./areas_database.service"
import { UserDatabaseService } from "./users_database.service"
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AreaSchema, SingleAreaSchema } from './schemas/area.schema';
import { TriggerDatabaseModule } from 'apps/area-trigger/src/database/trigger_database.module';

@Module({
  imports: [TriggerDatabaseModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Area', schema: AreaSchema }, { name: 'SingleArea', schema: SingleAreaSchema }])],
  providers: [AreaDatabaseService, UserDatabaseService, SingleAreaDatabaseService],
  exports:[AreaDatabaseService, UserDatabaseService, SingleAreaDatabaseService],
})
export class DatabaseModule { }
