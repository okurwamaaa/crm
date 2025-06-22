import { Injectable, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientCommand } from '../commands/create-client.command';
import { UpdateClientCommand } from '../commands/update-client.command';
import { DeleteClientCommand } from '../commands/delete-client.command';
import { GetClientQuery } from '../queries/get-client.query';
import { GetClientsQuery } from '../queries/get-clients.query';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Client } from '../models/client.model';
import { SERVICE_TOKENS } from '../../common/constants/injection-tokens';

@Injectable()
export class ClientService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    return this.commandBus.execute(new CreateClientCommand(createClientDto));
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    return this.commandBus.execute(new UpdateClientCommand(id, updateClientDto));
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.commandBus.execute(new DeleteClientCommand(id));
  }

  async getClient(id: number): Promise<Client> {
    return this.queryBus.execute(new GetClientQuery(id));
  }

  async getClients(
    page: number = 1,
    limit: number = 10,
    filter?: any,
    sort?: { field: keyof Client; direction: 'ASC' | 'DESC' }
  ) {
    return this.queryBus.execute(new GetClientsQuery(page, limit, filter, sort));
  }
} 