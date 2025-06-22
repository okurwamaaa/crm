import { ICommand } from '@nestjs/cqrs';
import { UpdateClientDto } from '../dto/update-client.dto';

export class UpdateClientCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly updateClientDto: UpdateClientDto
  ) {}
} 