import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ClientResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiPropertyOptional()
  phone?: string;
  @ApiPropertyOptional()
  address?: string;
  @ApiProperty()
  status: string;
  @ApiPropertyOptional()
  lastContactDate?: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
} 
