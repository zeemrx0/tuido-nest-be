import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Task } from '@task/domain/task.model';
import { TaskConditionDto, UpdateTaskDto } from '@task/domain/task.dto';
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from '@shared/repositories';
import { ITaskRepository } from '@task/domain/task.port';

const modelName = 'Task';

@Injectable()
export class MySQLTaskRepository
  extends BaseRepositorySequelize<Task, TaskConditionDto, UpdateTaskDto>
  implements ITaskRepository
{
  constructor(@InjectConnection() readonly sequelize: Sequelize) {
    const queryRepo = new MySQLTaskQueryRepository(sequelize, modelName);
    const commandRepo = new MySQLTaskCommandRepository(sequelize, modelName);

    super(queryRepo, commandRepo);
  }

  async findAll(userId: string): Promise<Task[]> {
    return await this.queryRepository.list({ userId } as any, { page: 1, limit: 1000, total: 0 });
  }
}

export class MySQLTaskCommandRepository extends BaseCommandRepositorySequelize<Task, UpdateTaskDto> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}

export class MySQLTaskQueryRepository extends BaseQueryRepositorySequelize<Task, TaskConditionDto> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}
