import { CreateTaskDto, TaskConditionDto, UpdateTaskDto } from '@task/domain/task.dto';
import { Task } from '@task/domain/task.model';
import { IRepository } from '@shared/interfaces';

export const TASK_REPOSITORY = Symbol('ITaskRepository');
export const TASK_SERVICE = Symbol('ITaskService');

export interface ITaskRepository extends IRepository<Task, TaskConditionDto, UpdateTaskDto> {
  findAll(userId: string): Promise<Task[]>;
}

export interface ITaskService {
  create(userId: string, task: CreateTaskDto): Promise<string>;
  findAll(userId: string): Promise<Task[]>;
  findOne(id: string): Promise<Task>;
  update(id: string, task: UpdateTaskDto): Promise<Task>;
  remove(id: string): Promise<void>;
}
