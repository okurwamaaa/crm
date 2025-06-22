import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateDealDto {
  @ApiProperty({ description: 'Deal title' })
  @IsString()
  title: string;
  @ApiPropertyOptional({ description: 'Deal description' })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ description: 'Deal amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;
  @ApiPropertyOptional({ 
    description: 'Deal stage',
    enum: ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'],
    default: 'PROSPECT'
  })
  @IsOptional()
  @IsEnum(['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'])
  stage?: string;
  @ApiPropertyOptional({ description: 'Expected close date' })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;
  @ApiPropertyOptional({ 
    description: 'Deal probability (0-1)',
    minimum: 0,
    maximum: 1,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  probability?: number;
  @ApiProperty({ description: 'Client ID this deal belongs to' })
  @IsNumber()
  clientId: number;
  @ApiPropertyOptional({ description: 'Contact ID associated with this deal' })
  @IsOptional()
  @IsNumber()
  contactId?: number;
} 
