import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TaskController } from '@task/infrastructure/transports/task-http.controller';
import { TaskService } from '@task/domain/task.service';
import { MySQLTaskRepository } from '@task/infrastructure/repositories/mysql/task.repository';
import { DatabaseModule } from '../../shared/database/database.module';
import { jwtConfig } from '@shared/config';
import { TASK_SERVICE, TASK_REPOSITORY } from '@task/domain/task.port';

@Module({
  imports: [DatabaseModule, JwtModule.register(jwtConfig)],
  controllers: [TaskController],
  providers: [
    {
      provide: TASK_SERVICE,
      useClass: TaskService,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: MySQLTaskRepository,
    },
  ],
})
export class TaskModule {}
