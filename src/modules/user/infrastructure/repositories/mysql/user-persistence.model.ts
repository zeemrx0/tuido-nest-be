import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Status } from '@user/domain/enums';
import { UserRole } from '@shared/enums';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'User',
})
export class UserPersistenceModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare salt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'phone_number',
  })
  declare phoneNumber: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  declare status: Status;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatar: string | null;

  @Column({
    type: DataType.STRING,
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;
}
