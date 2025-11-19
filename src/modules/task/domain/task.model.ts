import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@task/domain/enums';
import * as TaskError from '@task/domain/errors';

export const taskSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  projectId: z.uuid().nullable().optional(),
  title: z.string().min(1, { message: TaskError.taskNotFound.message }), // Using a placeholder error message for now as specific validation errors weren't defined
  description: z.string().nullable().optional(),
  status: z.enum(TaskStatus).default(TaskStatus.UNDONE),
  priority: z.enum(TaskPriority).default(TaskPriority.NOT_URGENT_NOT_IMPORTANT),
  dueDate: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
