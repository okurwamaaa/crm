import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Deal } from '../models/deal.model';
import { IBaseRepository, IPaginatedRepository, ISearchableRepository } from '../../common/interfaces/repository.interface';

@Injectable()
export class DealRepository implements IBaseRepository<Deal>, IPaginatedRepository<Deal>, ISearchableRepository<Deal> {
  constructor(
    @InjectModel(Deal)
    private readonly dealModel: typeof Deal
  ) {}

  async findById(id: string | number): Promise<Deal | null> {
    return this.dealModel.findByPk(id, {
      include: ['client', 'contact']
    });
  }

  async findAll(): Promise<Deal[]> {
    return this.dealModel.findAll({
      include: ['client', 'contact']
    });
  }

  async findOne(filter: Partial<Deal>): Promise<Deal | null> {
    return this.dealModel.findOne({ 
      where: filter,
      include: ['client', 'contact']
    });
  }

  async findMany(filter: Partial<Deal>): Promise<Deal[]> {
    return this.dealModel.findAll({ 
      where: filter,
      include: ['client', 'contact']
    });
  }

  async create(data: Partial<Deal>): Promise<Deal> {
    return this.dealModel.create(data);
  }

  async update(id: string | number, data: Partial<Deal>): Promise<Deal> {
    const deal = await this.findById(id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    await deal.update(data);
    return deal;
  }

  async delete(id: string | number): Promise<boolean> {
    const deletedCount = await this.dealModel.destroy({
      where: { id }
    });
    return deletedCount > 0;
  }

  async exists(id: string | number): Promise<boolean> {
    const count = await this.dealModel.count({
      where: { id }
    });
    return count > 0;
  }

  async count(filter?: Partial<Deal>): Promise<number> {
    return this.dealModel.count({ where: filter });
  }

  async findPaginated(
    page: number,
    limit: number,
    filter?: Partial<Deal>,
    sort?: { field: keyof Deal; direction: 'ASC' | 'DESC' }
  ): Promise<{
    data: Deal[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const where = filter || {};
    const order = sort ? [[sort.field, sort.direction] as [string, string]] : [['createdAt', 'DESC'] as [string, string]];

    const [data, total] = await Promise.all([
      this.dealModel.findAll({
        where,
        order,
        limit,
        offset,
        include: ['client', 'contact']
      }),
      this.dealModel.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async search(query: string, fields: (keyof Deal)[]): Promise<Deal[]> {
    const searchConditions = fields.map(field => ({
      [field]: {
        [Op.iLike]: `%${query}%`
      }
    }));

    return this.dealModel.findAll({
      where: {
        [Op.or]: searchConditions
      },
      include: ['client', 'contact']
    });
  }

  async findByClientId(clientId: number): Promise<Deal[]> {
    return this.findMany({ clientId } as Partial<Deal>);
  }

  async findByStage(stage: string): Promise<Deal[]> {
    return this.findMany({ stage } as Partial<Deal>);
  }

  async findByAmountRange(minAmount: number, maxAmount: number): Promise<Deal[]> {
    return this.dealModel.findAll({
      where: {
        amount: {
          [Op.between]: [minAmount, maxAmount]
        }
      },
      include: ['client', 'contact']
    });
  }

  async getTotalDealValue(filter?: Partial<Deal>): Promise<number> {
    const result = await this.dealModel.sum('amount', { where: filter });
    return result || 0;
  }
} 