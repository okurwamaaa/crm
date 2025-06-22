import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateClientCommand } from '../commands/update-client.command';
import { Client } from '../models/client.model';
import { ClientRepository } from '../repositories/client.repository';
import { ClientNotFoundException, ClientAlreadyExistsException } from '../../common/exceptions/crm.exception';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';
@Injectable()
@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler implements ICommandHandler<UpdateClientCommand> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}
  async execute(command: UpdateClientCommand): Promise<Client> {
    const { id, updateClientDto } = command;
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new ClientNotFoundException(id);
    }
    if (updateClientDto.email && updateClientDto.email !== existingClient.email) {
      const clientWithEmail = await this.clientRepository.findByEmail(updateClientDto.email);
      if (clientWithEmail && clientWithEmail.id !== id) {
        throw new ClientAlreadyExistsException(updateClientDto.email);
      }
    }
    const updatedClient = await this.clientRepository.update(id, updateClientDto);
    return updatedClient;
  }
} 
