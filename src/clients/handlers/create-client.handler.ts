import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { CreateClientCommand } from '../commands/create-client.command';
import { Client } from '../models/client.model';
import { ClientRepository } from '../repositories/client.repository';
import { ClientAlreadyExistsException, InvalidClientDataException } from '../../common/exceptions/crm.exception';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';

@Injectable()
@CommandHandler(CreateClientCommand)
export class CreateClientHandler implements ICommandHandler<CreateClientCommand> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(command: CreateClientCommand): Promise<Client> {
    const { createClientDto } = command;

    // Validate required fields
    if (!createClientDto.name || !createClientDto.email) {
      throw new InvalidClientDataException('Name and email are required');
    }

    // Check if client with email already exists
    const existingClient = await this.clientRepository.findByEmail(createClientDto.email);
    if (existingClient) {
      throw new ClientAlreadyExistsException(createClientDto.email);
    }

    // Create the client
    const client = await this.clientRepository.create({
      name: createClientDto.name,
      email: createClientDto.email,
      phone: createClientDto.phone,
      address: createClientDto.address,
      status: createClientDto.status || 'PROSPECT'
    });

    return client;
  }
} 