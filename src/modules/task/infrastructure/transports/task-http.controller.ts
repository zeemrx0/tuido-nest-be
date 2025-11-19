import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from '@task/domain/task.dto';
import { JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { TokenPayload } from '@shared/interfaces';
import { ITaskService, TASK_SERVICE } from '@task/domain/task.port';

@Controller('v1/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject(TASK_SERVICE)
    private readonly taskService: ITaskService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: TokenPayload, @Body() dto: CreateTaskDto) {
    const taskId = await this.taskService.create(user.subject, dto);
    return { data: taskId };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: TokenPayload) {
    const tasks = await this.taskService.findAll(user.subject);
    return { data: tasks };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return { data: task };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const task = await this.taskService.update(id, dto);
    return { data: task };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.taskService.remove(id);
  }
}
