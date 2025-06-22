import { Injectable, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateClientCommand } from '../commands/create-client.command';
import { UpdateClientCommand } from '../commands/update-client.command';
import { DeleteClientCommand } from '../commands/delete-client.command';
import { GetClientQuery } from '../queries/get-client.query';
import { GetClientsQuery } from '../queries/get-clients.query';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Client } from '../models/client.model';
import { SERVICE_TOKENS } from '../../common/constants/injection-tokens';
import { CacheProxy as CacheProxyDecorator } from '../../common/decorators/cache-proxy.decorator';
import { LoggerDecorator } from '../../common/decorators/logger-decorator';
@Injectable()
export class ClientService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  @LoggerDecorator({
    level: 'log',
    includeParams: true,
    includeExecutionTime: true
  })
  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    return this.commandBus.execute(new CreateClientCommand(createClientDto));
  }
  @CacheProxyDecorator({
    ttl: 300,
    key: 'client:update',
    prefix: 'client-service'
  })
  async updateClient(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    return this.commandBus.execute(new UpdateClientCommand(id, updateClientDto));
  }
  @LoggerDecorator({
    level: 'warn',
    includeParams: true,
    customMessage: 'Deleting client'
  })
  async deleteClient(id: number): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientCommand(id));
  }
  @CacheProxyDecorator({
    ttl: 600,
    prefix: 'client-service'
  })
  async getClient(id: number): Promise<Client> {
    return this.queryBus.execute(new GetClientQuery(id));
  }
  @LoggerDecorator({
    level: 'log',
    includeParams: true,
    includeExecutionTime: true
  })
  async getClients(
    page: number = 1,
    limit: number = 10,
    filter?: any,
    sort?: { field: keyof Client; direction: 'ASC' | 'DESC' }
  ) {
    return this.queryBus.execute(new GetClientsQuery(page, limit, filter, sort));
  }
  @CacheProxyDecorator({ ttl: 1800, prefix: 'client-service' })
  @LoggerDecorator({ 
    level: 'debug', 
    includeParams: true, 
    includeResult: true 
  })
  async getClientWithCacheAndLog(id: number): Promise<Client> {
    return this.queryBus.execute(new GetClientQuery(id));
  }
} 
