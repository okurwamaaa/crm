import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientResponseDto } from '../dto/client-response.dto';
import { Client } from '../models/client.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { OwnershipGuard } from '../../auth/guards/ownership.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.model';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully', type: ClientResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid client data' })
  @ApiResponse({ status: 409, description: 'Client with email already exists' })
  @Roles(UserRole.ADMIN)
  async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  async getClients(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: keyof Client,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    const filter = status ? { status } : undefined;
    const sort = sortBy ? { field: sortBy, direction: sortOrder } : undefined;
    return this.clientService.getClients(page, limit, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @UseGuards(OwnershipGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  async getClient(@Param('id') id: string): Promise<Client> {
    return this.clientService.getClient(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Client with email already exists' })
  @UseGuards(OwnershipGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<Client> {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Roles(UserRole.ADMIN)
  async deleteClient(@Param('id') id: string): Promise<void> {
    await this.clientService.deleteClient(id);
  }
} 
