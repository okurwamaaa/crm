import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Client } from '../models/client.model';
import { IBaseRepository, IPaginatedRepository, ISearchableRepository } from '../../common/interfaces/repository.interface';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';
@Injectable()
export class ClientRepository implements IBaseRepository<Client>, IPaginatedRepository<Client>, ISearchableRepository<Client> {
  constructor(
    @InjectModel(Client)
    private readonly clientModel: typeof Client
  ) {}
  async findById(id: string | number): Promise<Client | null> {
    return this.clientModel.findByPk(id);
  }
  async findAll(): Promise<Client[]> {
    return this.clientModel.findAll();
  }
  async findOne(filter: Partial<Client>): Promise<Client | null> {
    return this.clientModel.findOne({ where: filter });
  }
  async findMany(filter: Partial<Client>): Promise<Client[]> {
    return this.clientModel.findAll({ where: filter });
  }
  async create(data: Partial<Client>): Promise<Client> {
    return this.clientModel.create(data);
  }
  async update(id: string | number, data: Partial<Client>): Promise<Client> {
    const client = await this.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    await client.update(data);
    return client;
  }
  async delete(id: string | number): Promise<boolean> {
    const deletedCount = await this.clientModel.destroy({
      where: { id }
    });
    return deletedCount > 0;
  }
  async exists(id: string | number): Promise<boolean> {
    const count = await this.clientModel.count({
      where: { id }
    });
    return count > 0;
  }
  async count(filter?: Partial<Client>): Promise<number> {
    return this.clientModel.count({ where: filter });
  }
  async findPaginated(
    page: number,
    limit: number,
    filter?: Partial<Client>,
    sort?: { field: keyof Client; direction: 'ASC' | 'DESC' }
  ): Promise<{
    data: Client[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const where = filter || {};
    const order = sort ? [[sort.field, sort.direction]] : [['createdAt', 'DESC']];
    const [data, total] = await Promise.all([
      this.clientModel.findAll({
        where,
        order,
        limit,
        offset
      }),
      this.clientModel.count({ where })
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  async search(query: string, fields: (keyof Client)[]): Promise<Client[]> {
    const searchConditions = fields.map(field => ({
      [field]: {
        [Op.iLike]: `%${query}%`
      }
    }));
    return this.clientModel.findAll({
      where: {
        [Op.or]: searchConditions
      }
    });
  }
  async findByEmail(email: string): Promise<Client | null> {
    return this.findOne({ email } as Partial<Client>);
  }
  async findByStatus(status: string): Promise<Client[]> {
    return this.findMany({ status } as Partial<Client>);
  }
} 
