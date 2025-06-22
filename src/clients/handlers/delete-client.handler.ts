import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { DeleteClientCommand } from '../commands/delete-client.command';
import { ClientRepository } from '../repositories/client.repository';
import { ClientNotFoundException } from '../../common/exceptions/crm.exception';
import { REPOSITORY_TOKENS } from '../../common/constants/injection-tokens';
@Injectable()
@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler implements ICommandHandler<DeleteClientCommand> {
  constructor(
    @Inject(REPOSITORY_TOKENS.CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository
  ) {}
  async execute(command: DeleteClientCommand): Promise<boolean> {
    const { id } = command;
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new ClientNotFoundException(id);
    }
    const deleted = await this.clientRepository.delete(id);
    return deleted;
  }
} 
