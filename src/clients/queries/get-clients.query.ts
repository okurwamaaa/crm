import { IQuery } from '@nestjs/cqrs';
import { Client } from '../models/client.model';
export class GetClientsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly filter?: any,
    public readonly sort?: { field: keyof Client; direction: 'ASC' | 'DESC' }
  ) {}
} 
