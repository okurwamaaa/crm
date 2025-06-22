import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "clients",
  timestamps: true
})
export class Client extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare phone: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare address: string;

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