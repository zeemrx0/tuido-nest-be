import { Inject, Injectable } from '@nestjs/common';
import { v7 } from 'uuid';
import { CreateTaskDto, createTaskDtoSchema, UpdateTaskDto, updateTaskDtoSchema } from '@task/domain/task.dto';
import { Task } from '@task/domain/task.model';
import { TaskPriority, TaskStatus } from '@task/domain/enums';
import * as TaskError from '@task/domain/errors';
import { ITaskRepository, ITaskService, TASK_REPOSITORY } from '@task/domain/task.port';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly repository: ITaskRepository,
  ) {}

  async create(userId: string, data: CreateTaskDto): Promise<string> {
    const dto = createTaskDtoSchema.parse(data);

    const newId = v7();
    const newTask: Task = {
      ...dto,
      id: newId,
      userId,
      projectId: null,
      status: dto.status ?? TaskStatus.UNDONE,
      priority: dto.priority ?? TaskPriority.NOT_URGENT_NOT_IMPORTANT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(newTask);

    return newId;
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.repository.findAll(userId);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repository.get(id);
    if (!task) {
      throw TaskError.taskNotFound;
    }
    return task;
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const dto = updateTaskDtoSchema.parse(data);

    const task = await this.repository.get(id);
    if (!task) {
      throw TaskError.taskNotFound;
    }

    await this.repository.update(id, dto);

    const updatedTask = await this.repository.get(id);
    if (!updatedTask) {
      throw TaskError.taskNotFound;
    }
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.repository.get(id);
    if (!task) {
      throw TaskError.taskNotFound;
    }
    await this.repository.delete(id, true);
  }
}
