import { IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../models/user.model';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
} 