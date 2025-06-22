import { ICommand } from '@nestjs/cqrs';
import { CreateContactDto } from '../dto/create-contact.dto';
export class CreateContactCommand implements ICommand {
  constructor(public readonly createContactDto: CreateContactDto) {}
} 
