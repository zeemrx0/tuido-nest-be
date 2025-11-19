import { NotFoundException } from '@nestjs/common';

export const taskNotFound = new NotFoundException('Task not found');
