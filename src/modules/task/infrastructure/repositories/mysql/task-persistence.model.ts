import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { TaskPriority, TaskStatus } from '@task/domain/enums';

@Table({
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'Task',
})
export class TaskPersistenceModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    defaultValue: TaskStatus.UNDONE,
    allowNull: false,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.TINYINT,
    defaultValue: TaskPriority.NOT_URGENT_NOT_IMPORTANT,
    allowNull: false,
  })
  declare priority: TaskPriority;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  declare dueDate: Date | null;
}
