export abstract class CrmException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ClientNotFoundException extends CrmException {
  constructor(clientId: string | number) {
    super(`Client with id ${clientId} not found`, 'CLIENT_NOT_FOUND', 404);
  }
}

export class ClientAlreadyExistsException extends CrmException {
  constructor(email: string) {
    super(`Client with email ${email} already exists`, 'CLIENT_ALREADY_EXISTS', 409);
  }
}

export class InvalidClientDataException extends CrmException {
  constructor(message: string) {
    super(message, 'INVALID_CLIENT_DATA', 400);
  }
}

export class ClientStatusTransitionException extends CrmException {
  constructor(fromStatus: string, toStatus: string) {
    super(`Invalid status transition from ${fromStatus} to ${toStatus}`, 'INVALID_STATUS_TRANSITION', 400);
  }
}

export class ContactNotFoundException extends CrmException {
  constructor(contactId: string | number) {
    super(`Contact with id ${contactId} not found`, 'CONTACT_NOT_FOUND', 404);
  }
}

export class DealNotFoundException extends CrmException {
  constructor(dealId: string | number) {
    super(`Deal with id ${dealId} not found`, 'DEAL_NOT_FOUND', 404);
  }
}

export class InvalidDealAmountException extends CrmException {
  constructor(amount: number) {
    super(`Invalid deal amount: ${amount}. Amount must be positive`, 'INVALID_DEAL_AMOUNT', 400);
  }
}

export class UnauthorizedAccessException extends CrmException {
  constructor(resource: string) {
    super(`Unauthorized access to ${resource}`, 'UNAUTHORIZED_ACCESS', 403);
  }
} 