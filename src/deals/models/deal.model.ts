import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Client } from "../../clients/models/client.model";
import { Contact } from "../../contacts/models/contact.model";
@Table({
  tableName: "deals",
  timestamps: true
})
export class Deal extends Model {
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
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare amount: number;
    @Column({
        type: DataType.ENUM('PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'),
        defaultValue: 'PROSPECT'
    })
    declare stage: string;
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare expectedCloseDate: Date;
    @Column({
        type: DataType.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0
    })
    declare probability: number;
    @ForeignKey(() => Client)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare clientId: number;
    @ForeignKey(() => Contact)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare contactId: number;
    @BelongsTo(() => Client)
    declare client: Client;
    @BelongsTo(() => Contact)
    declare contact: Contact;
} 
