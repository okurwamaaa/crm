import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Contact } from '../models/contact.model';
import { IBaseRepository, IPaginatedRepository, ISearchableRepository } from '../../common/interfaces/repository.interface';
@Injectable()
export class ContactRepository implements IBaseRepository<Contact>, IPaginatedRepository<Contact>, ISearchableRepository<Contact> {
  constructor(
    @InjectModel(Contact)
    private readonly contactModel: typeof Contact
  ) {}
  async findById(id: string | number): Promise<Contact | null> {
    return this.contactModel.findByPk(id, {
      include: ['client']
    });
  }
  async findAll(): Promise<Contact[]> {
    return this.contactModel.findAll({
      include: ['client']
    });
  }
  async findOne(filter: Partial<Contact>): Promise<Contact | null> {
    return this.contactModel.findOne({ 
      where: filter,
      include: ['client']
    });
  }
  async findMany(filter: Partial<Contact>): Promise<Contact[]> {
    return this.contactModel.findAll({ 
      where: filter,
      include: ['client']
    });
  }
  async create(data: Partial<Contact>): Promise<Contact> {
    return this.contactModel.create(data);
  }
  async update(id: string | number, data: Partial<Contact>): Promise<Contact> {
    const contact = await this.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    await contact.update(data);
    return contact;
  }
  async delete(id: string | number): Promise<boolean> {
    const deletedCount = await this.contactModel.destroy({
      where: { id }
    });
    return deletedCount > 0;
  }
  async exists(id: string | number): Promise<boolean> {
    const count = await this.contactModel.count({
      where: { id }
    });
    return count > 0;
  }
  async count(filter?: Partial<Contact>): Promise<number> {
    return this.contactModel.count({ where: filter });
  }
  async findPaginated(
    page: number,
    limit: number,
    filter?: Partial<Contact>,
    sort?: { field: keyof Contact; direction: 'ASC' | 'DESC' }
  ): Promise<{
    data: Contact[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const where = filter || {};
    const order = sort ? [[sort.field, sort.direction] as [string, string]] : [['createdAt', 'DESC'] as [string, string]];
    const [data, total] = await Promise.all([
      this.contactModel.findAll({
        where,
        order,
        limit,
        offset,
        include: ['client']
      }),
      this.contactModel.count({ where })
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  async search(query: string, fields: (keyof Contact)[]): Promise<Contact[]> {
    const searchConditions = fields.map(field => ({
      [field]: {
        [Op.iLike]: `%${query}%`
      }
    }));
    return this.contactModel.findAll({
      where: {
        [Op.or]: searchConditions
      },
      include: ['client']
    });
  }
  async findByEmail(email: string): Promise<Contact | null> {
    return this.findOne({ email } as Partial<Contact>);
  }
  async findByClientId(clientId: number): Promise<Contact[]> {
    return this.findMany({ clientId } as Partial<Contact>);
  }
  async findByRole(role: string): Promise<Contact[]> {
    return this.findMany({ role } as Partial<Contact>);
  }
} 
