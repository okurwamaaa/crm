import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repositories/client.repository';
import { CreateClientHandler } from './handlers/create-client.handler';
import { UpdateClientHandler } from './handlers/update-client.handler';
import { DeleteClientHandler } from './handlers/delete-client.handler';
import { GetClientHandler } from './handlers/get-client.handler';
import { GetClientsHandler } from './handlers/get-clients.handler';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../common/constants/injection-tokens';
const CommandHandlers = [
  CreateClientHandler,
  UpdateClientHandler,
  DeleteClientHandler,
];
const QueryHandlers = [
  GetClientHandler,
  GetClientsHandler,
];
@Module({
  imports: [
    CqrsModule,
    SequelizeModule.forFeature([Client])
  ],
  controllers: [ClientController],
  providers: [
    {
      provide: REPOSITORY_TOKENS.CLIENT_REPOSITORY,
      useClass: ClientRepository,
    },
    {
      provide: SERVICE_TOKENS.CLIENT_SERVICE,
      useClass: ClientService,
    },
    ClientService,
    ClientRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    ClientService,
    {
      provide: REPOSITORY_TOKENS.CLIENT_REPOSITORY,
      useClass: ClientRepository,
    },
  ],
})
export class ClientsModule {}
