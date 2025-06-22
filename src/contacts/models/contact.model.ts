import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Client } from "../../clients/models/client.model";

@Table({
  tableName: "contacts",
  timestamps: true
})
export class Contact extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare lastName: string;

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
        type: DataType.STRING,
        allowNull: true
    })
    declare position: string;

    @Column({
        type: DataType.ENUM('PRIMARY', 'SECONDARY', 'DECISION_MAKER'),
        defaultValue: 'SECONDARY'
    })
    declare role: string;

    @ForeignKey(() => Client)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare clientId: number;

    @BelongsTo(() => Client)
    declare client: Client;
} 