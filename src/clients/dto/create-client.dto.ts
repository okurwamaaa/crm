import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Client email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ 
    description: 'Client status',
    enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'],
    default: 'PROSPECT'
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'PROSPECT'])
  status?: string;
} 