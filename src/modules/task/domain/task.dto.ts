import { z } from 'zod';
import { taskSchema } from '@task/domain/task.model';

// Create Task DTO
export const createTaskDtoSchema = taskSchema.pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
});

export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>;

// Update Task DTO
export const updateTaskDtoSchema = taskSchema.partial().pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
});

export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>;

// Task Condition DTO
export const taskConditionDtoSchema = taskSchema.partial().pick({
  userId: true,
  projectId: true,
  title: true,
  status: true,
  priority: true,
});

export type TaskConditionDto = z.infer<typeof taskConditionDtoSchema>;
