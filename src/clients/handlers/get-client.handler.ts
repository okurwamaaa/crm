import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetClientQuery } from '../queries/get-client.query';
import { Client } from '../models/client.model';
import { ClientRepository } from '../repositories/client.repository';
import { ClientNotFoundException } from '../../common/exceptions/crm.exception';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';

@Injectable()
@QueryHandler(GetClientQuery)
export class GetClientHandler implements IQueryHandler<GetClientQuery> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(query: GetClientQuery): Promise<Client> {
    const { id } = query;

    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundException(id);
    }

    return client;
  }
} 