import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RegisterAddressDto {
  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  complement: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip_code: string;
}

export class RegisterProfileDto {
  @IsString()
  name: string;

  @IsString()
  phone_number: string;

  @Type(() => Date)
  @IsDate({ message: 'birth_date deve ser uma data válida (ex: 1995-08-15)' })
  birth_date: Date;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;
}

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @ValidateNested()
  @Type(() => RegisterProfileDto)
  profile: RegisterProfileDto;

  @ValidateNested()
  @Type(() => RegisterAddressDto)
  address: RegisterAddressDto;
}