import { IQuery } from '@nestjs/cqrs';
export class GetClientQuery implements IQuery {
  constructor(public readonly id: number) {}
} 
