import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { User } from '@user/domain/user.model';
import { UserConditionDto, UserUpdateDto } from '@user/domain/user.dto';
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from '@shared/repositories';
import { initUserPersistenceModel, modelName } from './user-persistence.model';

@Injectable()
export class MySQLUserRepository extends BaseRepositorySequelize<User, UserConditionDto, UserUpdateDto> {
  constructor(@InjectConnection() readonly sequelize: Sequelize) {
    // Initialize the model
    initUserPersistenceModel(sequelize);

    // Create query and command repositories
    const queryRepo = new MySQLUserQueryRepository(sequelize, modelName);
    const commandRepo = new MySQLUserCommandRepository(sequelize, modelName);

    super(queryRepo, commandRepo);
  }
}

export class MySQLUserCommandRepository extends BaseCommandRepositorySequelize<User, UserUpdateDto> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}

export class MySQLUserQueryRepository extends BaseQueryRepositorySequelize<User, UserConditionDto> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}
