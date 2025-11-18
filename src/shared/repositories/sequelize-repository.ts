import { ICommandRepository, IQueryRepository, IRepository } from '../interfaces';
import { PagingDto } from '../models/paging.dto';
import { Op, Sequelize } from 'sequelize';
import { ModelStatus } from '../enums';

export abstract class BaseRepositorySequelize<Entity, Condition, UpdateDto>
  implements IRepository<Entity, Condition, UpdateDto>
{
  protected constructor(
    readonly queryRepository: IQueryRepository<Entity, Condition>,
    readonly commandRepository: ICommandRepository<Entity, UpdateDto>,
  ) {}

  async get(id: string): Promise<Entity | null> {
    return await this.queryRepository.get(id);
  }

  async findByCondition(cond: Condition): Promise<Entity | null> {
    return await this.queryRepository.findByCondition(cond);
  }

  async list(cond: Condition, paging: PagingDto): Promise<Array<Entity>> {
    return await this.queryRepository.list(cond, paging);
  }

  async insert(data: Entity): Promise<boolean> {
    return await this.commandRepository.insert(data);
  }

  async update(id: string, data: UpdateDto): Promise<boolean> {
    return await this.commandRepository.update(id, data);
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    return await this.commandRepository.delete(id, isHard);
  }
}

export abstract class BaseQueryRepositorySequelize<Entity, Cond> implements IQueryRepository<Entity, Cond> {
  protected constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {}

  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;

    return {
      ...props,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity;
  }

  async findByCondition(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: cond as any,
    });

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    return persistenceData as Entity;
  }

  async list(cond: Cond, paging: PagingDto): Promise<Array<Entity>> {
    const { page, limit } = paging;

    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };

    paging.total = await this.sequelize.models[this.modelName].count({
      where: condSQL,
    });

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    return rows.map((row) => row.get({ plain: true }));
  }
}

export abstract class BaseCommandRepositorySequelize<Entity, UpdateDto>
  implements ICommandRepository<Entity, UpdateDto>
{
  protected constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {}

  async insert(data: Entity): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: UpdateDto): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id },
    });
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }

    return true;
  }
}
