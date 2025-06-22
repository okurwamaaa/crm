import { ICommand } from '@nestjs/cqrs';

export class DeleteClientCommand implements ICommand {
  constructor(public readonly id: number) {}
} 