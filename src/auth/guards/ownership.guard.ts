import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/models/user.model';
import { ClientService } from '../../clients/services/client.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private clientService: ClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    if (user.role === UserRole.EMPLOYER) {
      const clientId = request.params.id;
      if (!clientId) {
        return true; 
      }
      const client = await this.clientService.getClient(clientId);
      if (client && client.userId === user.userId) {
        return true;
      }
    }

    throw new ForbiddenException('You do not have permission to access this resource.');
  }
} 