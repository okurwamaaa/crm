import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'clients',
  timestamps: true,
})
export class Client extends Model<Client> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE', 'PROSPECT'),
    defaultValue: 'PROSPECT'
  })
  declare status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare lastContactDate: Date;
}
