import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Contact first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Contact last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Contact email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Contact position/title' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ 
    description: 'Contact role',
    enum: ['PRIMARY', 'SECONDARY', 'DECISION_MAKER'],
    default: 'SECONDARY'
  })
  @IsOptional()
  @IsEnum(['PRIMARY', 'SECONDARY', 'DECISION_MAKER'])
  role?: string;

  @ApiProperty({ description: 'Client ID this contact belongs to' })
  @IsNumber()
  clientId: number;
} 