import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetClientsQuery } from '../queries/get-clients.query';
import { ClientRepository } from '../repositories/client.repository';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';
@Injectable()
@QueryHandler(GetClientsQuery)
export class GetClientsHandler implements IQueryHandler<GetClientsQuery> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}
  async execute(query: GetClientsQuery) {
    const { page, limit, filter, sort } = query;
    return this.clientRepository.findPaginated(page, limit, filter, sort);
  }
} 
