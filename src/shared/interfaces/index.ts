import { PagingDto } from '../models/paging.dto';

export interface IRepository<Entity, Condition, UpdateDto>
  extends IQueryRepository<Entity, Condition>,
    ICommandRepository<Entity, UpdateDto> {}

export interface IQueryRepository<Entity, Condition> {
  get(id: string): Promise<Entity | null>;
  findByCondition(cond: Condition): Promise<Entity | null>;
  list(cond: Condition, paging: PagingDto): Promise<Array<Entity>>;
}

export interface ICommandRepository<Entity, UpdateDto> {
  insert(data: Entity): Promise<boolean>;
  update(id: string, data: UpdateDto): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}

export interface ICommandHandler<Command, Result> {
  execute(command: Command): Promise<Result>;
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>;
}

export interface TokenPayload {
  subject: string;
}

export interface ITokenService {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
}
