import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Client } from "../../clients/models/client.model";
import { Contact } from "../../contacts/models/contact.model";
import { Deal } from "../../deals/models/deal.model";
@Table({
  tableName: "tasks",
  timestamps: true
})
export class Task extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string;
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;
    @Column({
        type: DataType.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDING'
    })
    declare status: string;
    @Column({
        type: DataType.ENUM('CALL', 'EMAIL', 'MEETING', 'FOLLOW_UP', 'PROPOSAL', 'OTHER'),
        defaultValue: 'OTHER'
    })
    declare type: string;
    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare dueDate: Date;
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare completedDate: Date;
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare priority: number;
    @ForeignKey(() => Client)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare clientId: number;
    @ForeignKey(() => Contact)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare contactId: number;
    @ForeignKey(() => Deal)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare dealId: number;
    @BelongsTo(() => Client)
    declare client: Client;
    @BelongsTo(() => Contact)
    declare contact: Contact;
    @BelongsTo(() => Deal)
    declare deal: Deal;
} 
