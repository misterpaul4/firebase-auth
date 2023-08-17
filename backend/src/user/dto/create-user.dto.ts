import { IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {}

export class CreateUserThirdPartyDto {
  @IsOptional()
  @IsString()
  phone: string;
}
