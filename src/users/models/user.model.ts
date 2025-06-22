import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/client.model';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @HasMany(() => Client)
  clients: Client[];

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 